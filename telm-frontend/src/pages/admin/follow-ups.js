import FollowupCommonPage from "@/components/common/pages/FollowupCommonPage";

const FollowUps = () => {
    const initialFilterState = {
        job_id: 'all',
        branch: 'all',
        stage: 'all',
        start_date: 'all',
        end_date: 'all'
    };
    return (
        <FollowupCommonPage initialFilterState={initialFilterState}/>
    )
}
export default FollowUps;