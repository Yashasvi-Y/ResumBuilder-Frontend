//export const BASE_URL = "https://resumbuilder-backend.onrender.com";
export const BASE_URL = "http://localhost:4000";

//utils/apiPath.js
export const API_PATHS = {

    AUTH: {
        REGISTER: "/api/auth/register",
        SEND_OTP: "/api/auth/send-otp",
        VERIFY_OTP: "/api/auth/verify-otp",
        LOGIN: "/api/auth/login",
        FORGOT_PASSWORD: "/api/auth/forgot-password",
        RESET_PASSWORD: "/api/auth/reset-password",
        GET_PROFILE: "/api/auth/profile",
    },
    RESUME: {
        CREATE: "/api/resume",
        GET_ALL: "/api/resume",
        GET_BY_ID: (id) => `/api/resume/${id}`,
        UPDATE: (id) => `/api/resume/${id}`,
        DELETE: (id) => `/api/resume/${id}`,
        UPLOAD_IMAGES: (id) => `/api/resume/${id}/upload-images`,
    },
    AI: {
        SUGGEST_WORK_DESCRIPTION: "/api/ai/suggest/work-description",
        SUGGEST_SKILLS: "/api/ai/suggest/skills",
        SUGGEST_PROJECT_DESCRIPTION: "/api/ai/suggest/project-description",
        SUGGEST_ACHIEVEMENTS: "/api/ai/suggest/achievements",
        SUGGEST_PROFESSIONAL_SUMMARY: "/api/ai/suggest/professional-summary",
    },
    image: {
        UPLOAD_IMAGE: "/api/auth/upload-image",
    },
};