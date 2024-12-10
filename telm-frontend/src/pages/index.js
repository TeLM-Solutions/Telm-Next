import {Card} from "@mui/material";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import {useAuth} from "@/hooks/auth";
import {useRouter} from "next/router";

const Index = () => {
    const {user} = useAuth({middleware: "auth"});
    const router = useRouter();

    // Determine the dashboard route based on the user's role.
    // let loginPage = '/login'
    let dashboardRoute = "/";
    if (user) {
        if (user.role === 'admin') {
            dashboardRoute = "/admin/dashboard";
        } else if (user.role === 'manager') {
            dashboardRoute = "/manager/dashboard";
        } else {
            dashboardRoute = "/executive/dashboard";
        }
        
    }

    // Redirect the user to the appropriate dashboard route.
    if (user) {
        router.push(dashboardRoute);
        return null ; // Redirecting, so no need to render anything.
    }

    return (
        <DefaultLayout>
            <Card sx={{width: "100%"}}>
            </Card>
        </DefaultLayout>
    );
};

export default Index;