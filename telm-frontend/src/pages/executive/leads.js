import LeadsCommonPage from "@/components/common/pages/LeadsCommonPage";

const Leads = () => {

    const initialFilterState = {
        service: 'all',
        classification: 'all',
        urgency: 'all',
        status: 'all',
        stage: 'all',
        start_date: 'all',
        end_date: 'all',
        route: 'all',
        location: 'all',
        source: 'all'
    };

    return (
        <LeadsCommonPage initialFilterState={initialFilterState}/>
    )
}
export default Leads;