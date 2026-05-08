import { useCallback, useMemo } from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from "../lib/msalConfig";
import axiosClient from "../lib/axiosClient";



export const useAuth = () =>{
    const isAuthenticated = useIsAuthenticated();

    const { instance, accounts, inProgress } = useMsal();
    const activeAccount = instance.getActiveAccount();

    // Determine if interactions can be performed - based on inProgress state
    const canInteract  = inProgress === "none";

    const login = useCallback(async () =>{
        if (canInteract && !isAuthenticated){
            await instance.loginRedirect(loginRequest);
        }
    }, [canInteract, isAuthenticated, instance]);

    const logout = useCallback(() =>{
        if (canInteract && isAuthenticated){
            instance.logoutRedirect({
                postLogoutRedirectUri: "/",
            });
        }   
    }, [canInteract, isAuthenticated, instance]);



    // getAccessToken function - to send the access token to backend
    const getAccessToken = useCallback(async () =>{
        try{
            let accountUsername = "";
            if(activeAccount){
                accountUsername = activeAccount.username;
            }
            if (!accountUsername) {
                throw new Error("No active account found");
            }
            const response = await instance.acquireTokenSilent({
                ...loginRequest,
                account: activeAccount
            });
            return response.accessToken;
        }
        catch(error){
            console.error("Error acquiring access token:", error);
            return null;
        }
    }, [instance, activeAccount]);


    // exchange the access token for a backend token and send it to the backend
    const exchangeTokenAndSendToBackend = useCallback(async () =>{
        try{
            const accessToken = await getAccessToken();
            if (!accessToken) {
                throw new Error("Failed to acquire access token");
            }
            const response =await axiosClient.post(
                                "/api/get-client-side-access-token",
                                {}, // body
                                {
                                    headers: {
                                        Authorization: `Bearer ${accessToken}`,
                                    },
                                }
                            );
            return response.data;
        }
        catch(error){
            console.error("Error exchanging token and sending to backend:", error);
            throw error;
        }
    }, [getAccessToken]);

    const fetchMeFromBackend = useCallback(async () => {
        try {
            const accessToken = await getAccessToken();
            if (!accessToken) {
                throw new Error("Failed to acquire access token");
            }

            const response = await axiosClient.get(
                "/api/me",
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            return response.data;
        }
        catch(error){
            console.error("Error fetching /api/me from backend:", error);
            throw error;
        }
    }, [getAccessToken]);


    return useMemo(() => ({
        isAuthenticated, 
        instance, 
        inProgress, 
        accounts, 
        activeAccount,
        canInteract, 
        login,
        logout, 
        getAccessToken,
        exchangeTokenAndSendToBackend,
        fetchMeFromBackend,
    }), [login, logout, isAuthenticated, activeAccount, instance, inProgress, accounts, canInteract, getAccessToken, exchangeTokenAndSendToBackend, fetchMeFromBackend]);

}

