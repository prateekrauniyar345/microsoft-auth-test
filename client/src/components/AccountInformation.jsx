import { msalConfig } from "../lib/msalConfig";
import { useState, useEffect, useRef, useCallback } from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";

const MsalAccountInformation = () => {
    const isAuthenticated = useIsAuthenticated();
    const { instance, accounts, inProgress } = useMsal();
    const activeAccount = instance.getActiveAccount();

    const [activeAccountAccessToken, setActiveAccountAccessToken] = useState(null);

    useEffect(() => {
        if (activeAccount) {
            const request = {
                account: activeAccount,
                scopes: ["User.Read"]
            };

            instance.acquireTokenSilent(request).then(response => {
                setActiveAccountAccessToken(response.accessToken);
            }).catch(error => {
                console.error("Error acquiring token:", error);
            });
        }
    }, [activeAccount, instance]);

    return (
        <>
            <div className="container">
                <h3 className="mt-5">Microsoft Account Information</h3>
                <hr />
                { isAuthenticated ? (
                    <div className="d-flex flex-column justify-content-start">
                        <div>
                            <h5>Accounts ({accounts.length})</h5>
                            {accounts.length > 0 ? (
                                <ul>
                                    {accounts.map((account, index) => (
                                        <li key={index}>
                                            {account.name} ({account.username})
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted">No accounts found</p>
                            )}
                        </div>
                        <hr />
                        <div>
                            <h5>Active Account</h5>
                            {activeAccount ? (
                                <div>
                                    <p><strong>Name:</strong> {activeAccount.name}</p>
                                    <p><strong>Username:</strong> {activeAccount.username}</p>
                                    <p><strong>Account ID:</strong> {activeAccount.localAccountId}</p>
                                </div>
                            ) : (
                                <p className="text-muted">No active account</p>
                            )}
                        </div>

                        {/* for getting the active access token */}
                        <div>
                            <h5>Active Account Access Token</h5>

                            {activeAccountAccessToken ? (
                                <div className="w-100 p-3 border border-secondary rounded d-flex flex-column justify-content-start">
                                <p className="mb-0 text-break">
                                    {activeAccountAccessToken}
                                </p>
                                </div>
                            ) : (
                                <p className="text-muted">No active account</p>
                            )}
                            </div>
                    </div> 
                ) : (
                    <p className="text-muted">No user is currently authenticated.</p>
                )}
            </div>
        
        </>
    )
}

export default MsalAccountInformation