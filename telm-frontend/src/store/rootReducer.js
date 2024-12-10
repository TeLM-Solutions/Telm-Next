import {combineReducers} from 'redux';
// slices
import branchesSlice from './slices/branchesSlice';
import branchManagersSlice from "./slices/managerSlice";
import executiveSlice from "@/store/slices/executiveSlice";
import serviceSlice from "@/store/slices/serviceSlice";
import routesSlice from "@/store/slices/routesSlice";
import leadSlice from "@/store/slices/leadSlice";
import jobSlice from "@/store/slices/jobSlice";
import followupSlice from "@/store/slices/followupSlice";
import dashboardSlice from "@/store/slices/dashboardSlice";
import reasonsSlice from "@/store/slices/reasonsSlice";
import reportSlice from "@/store/slices/reportSlice";
import jobDocumentTypesSlice from "@/store/slices/jobDocumentTypesSlice";
import leadStagesSlice from "@/store/slices/leadStagesSlice";
import leadSourcesSlice from "@/store/slices/leadSourcesSlice";

const rootReducer = combineReducers({
    branches: branchesSlice,
    managers: branchManagersSlice,
    executives: executiveSlice,
    services: serviceSlice,
    routes: routesSlice,
    leads: leadSlice,
    jobs: jobSlice,
    followups: followupSlice,
    dashboard: dashboardSlice,
    reasons: reasonsSlice,
    reports: reportSlice,
    jobDocumentTypes: jobDocumentTypesSlice,
    leadStages: leadStagesSlice,
    leadSources: leadSourcesSlice
});

export {rootReducer};