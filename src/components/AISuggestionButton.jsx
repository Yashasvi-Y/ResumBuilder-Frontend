import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const AISuggestionButton = ({
    type, // 'work-description', 'skills', 'project', 'achievements', 'summary'
    data, // { company, role, description } for work, etc.
    onApply, // callback when user applies suggestion
    buttonClass = "text-blue-600 hover:text-blue-800",
}) => {
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [attemptNumber, setAttemptNumber] = useState(0); // Track attempt for cache busting

    const getSuggestion = async () => {
        // Check if user is logged in
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please log in first to use AI suggestions");
            return;
        }

        setLoading(true);
        try {
            let endpoint = "";
            let payload = {};

            switch (type) {
                case "work-description":
                    endpoint = API_PATHS.AI.SUGGEST_WORK_DESCRIPTION;
                    payload = {
                        company: data.company,
                        role: data.role,
                        description: data.description,
                        _attempt: attemptNumber, // Add attempt number to bust cache
                    };
                    break;
                case "skills":
                    endpoint = API_PATHS.AI.SUGGEST_SKILLS;
                    payload = {
                        role: data.role,
                        experience: data.experience,
                        _attempt: attemptNumber,
                    };
                    break;
                case "project":
                    endpoint = API_PATHS.AI.SUGGEST_PROJECT_DESCRIPTION;
                    payload = {
                        projectTitle: data.title,
                        description: data.description,
                        _attempt: attemptNumber,
                    };
                    break;
                case "achievements":
                    endpoint = API_PATHS.AI.SUGGEST_ACHIEVEMENTS;
                    payload = {
                        role: data.role,
                        responsibility: data.responsibility,
                        _attempt: attemptNumber,
                    };
                    break;
                case "summary":
                    endpoint = API_PATHS.AI.SUGGEST_PROFESSIONAL_SUMMARY;
                    payload = {
                        jobTitle: data.jobTitle,
                        experience: data.experience,
                        skills: data.skills,
                        _attempt: attemptNumber,
                    };
                    break;
                default:
                    toast.error("Invalid suggestion type");
                    return;
            }

            // Make API call
            const response = await axiosInstance.post(endpoint, payload);

            if (response.data.success) {
                // Add new suggestion to list (don't replace)
                const result = response.data.suggestion || response.data.skills;
                const newSuggestion = Array.isArray(result) ? result : [result];
                
                const updatedSuggestions = [...suggestions, newSuggestion[0]];
                setSuggestions(updatedSuggestions);
                setSelectedIndex(suggestions.length); // Select the new one
                setAttemptNumber(attemptNumber + 1); // Increment for next "Try Another"
                
                // Open modal if this is the first suggestion
                if (!showModal) {
                    setShowModal(true);
                }
                
                // Show quota info if available
                if (response.data.quotaRemaining !== undefined) {
                    toast.success(`✨ Suggestion added! (${response.data.quotaRemaining} left today)`);
                } else {
                    toast.success("✨ New suggestion added!");
                }
            } else {
                toast.error(response.data.message || "Failed to get suggestion");
            }
        } catch (error) {
            console.error("Error getting suggestion:", error);
            if (error.response?.status === 401) {
                toast.error("Session expired. Please log in again.");
            } else if (error.response?.status === 429) {
                // Rate limit error
                const remaining = error.response?.data?.retryAfter;
                const msg = error.response?.data?.message || "Daily AI suggestion limit reached";
                if (remaining) {
                    toast.error(`${msg} (wait ${Math.ceil(remaining / 60)} mins)`);
                } else {
                    toast.error(msg);
                }
            } else {
                const errorMsg = error.response?.data?.message || error.message || "Failed to get AI suggestion. Please try again.";
                toast.error(errorMsg);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleApply = () => {
        onApply(suggestions[selectedIndex]);
        setShowModal(false);
        setSuggestions([]);
        setSelectedIndex(0);
        setAttemptNumber(0); // Reset for next field
        toast.success("✅ Suggestion applied!");
    };

    const handleSkip = () => {
        setShowModal(false);
        setSuggestions([]);
        setSelectedIndex(0);
        setAttemptNumber(0); // Reset for next field
    };

    const renderSuggestion = (suggestion) => {
        if (Array.isArray(suggestion)) {
            return (
                <ul className="space-y-2">
                    {suggestion.map((item, idx) => (
                        <li key={idx} className="text-sm text-gray-800">
                            • {item}
                        </li>
                    ))}
                </ul>
            );
        }
        return <p className="text-sm text-gray-800 whitespace-pre-wrap">{suggestion}</p>;
    };

    return (
        <>
            <button
                type="button"
                onClick={getSuggestion}
                disabled={loading}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                    loading ? "opacity-50 cursor-not-allowed" : buttonClass
                }`}
                title="Get AI suggestions"
            >
                <Sparkles size={16} />
                {loading ? "Generating..." : "✨ Suggest"}
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-3xl w-full">
                        <h3 className="text-lg font-bold mb-2">💡 AI Suggestions</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            {suggestions.length === 1
                                ? "Here's my recommendation:"
                                : `Got ${suggestions.length} options! Pick your favorite:`}
                        </p>

                        {/* Multiple Suggestions with Selection */}
                        {suggestions.length > 1 ? (
                            <div className="space-y-3 mb-6 max-h-80 overflow-y-auto">
                                {suggestions.map((suggestion, idx) => (
                                    <label
                                        key={idx}
                                        className={`block p-4 rounded-lg border-2 cursor-pointer transition ${
                                            selectedIndex === idx
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-200 bg-gray-50 hover:border-blue-300"
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <input
                                                type="radio"
                                                name="suggestion"
                                                checked={selectedIndex === idx}
                                                onChange={() => setSelectedIndex(idx)}
                                                className="mt-1"
                                            />
                                            <div className="flex-1">
                                                <p className="font-semibold text-sm mb-2">Option {idx + 1}</p>
                                                <div className="text-sm text-gray-800">
                                                    {renderSuggestion(suggestion)}
                                                </div>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            /* Single Suggestion */
                            <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200 mb-6 max-h-64 overflow-y-auto">
                                {suggestions.length > 0 && renderSuggestion(suggestions[0])}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleSkip}
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                            >
                                Skip
                            </button>
                            <button
                                onClick={() => getSuggestion()}
                                disabled={loading || suggestions.length >= 3}
                                className="flex-1 px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                title={suggestions.length >= 3 ? "Maximum 3 options collected" : ""}
                            >
                                {loading ? "Generating..." : suggestions.length >= 3 ? "Got 3 options!" : "Try Another ↻"}
                            </button>
                            <button
                                onClick={handleApply}
                                className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
                            >
                                Apply ✓
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AISuggestionButton;
