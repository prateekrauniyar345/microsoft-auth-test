import { use } from "react";
import { useState, useEffect, useRef } from "react";
import axiosClient from "../lib/axiosClient";

const BackendTest = () => {
    const [defaultRouteResponse, setDefaultRouteResponse] = useState(null);
    const [apiGetInfoResponse, setApiGetInfoResponse] = useState(null);
    const [apiVersionResponse, setApiVersionResponse] = useState(null);

    useEffect(()=>{
        // get default route response
        async function getDefaultRoute(){
            const response = await axiosClient.get('/');
            setDefaultRouteResponse(response.data);
        }

        // get /api/info route response
        async function getApiInfoRoute(){
            const response = await axiosClient.get('/api/info');
            setApiGetInfoResponse(response.data);
        }

        // get /api/version route response
        async function getApiVersionRoute(){
            const response = await axiosClient.get('/api/version');
            setApiVersionResponse(response.data);
        }


        if(!defaultRouteResponse){
            getDefaultRoute();
        }
        if(!apiGetInfoResponse){
            getApiInfoRoute();
        }
        if(!apiVersionResponse){
            getApiVersionRoute();
        }


    }, [defaultRouteResponse, apiGetInfoResponse, apiVersionResponse]);



    return (
        <>
            <div className="container p-5">
                <h3>Backend Resposne : </h3>
                <hr />
                {defaultRouteResponse ? (
                    <div className="border border-primary mt-3 d-flex justify-content-start align-items-center p-3">
                        <p className="me-2">The route is : "/api/"</p>
                        <pre className="mb-0 ms-3 border border-secondary p-2">{JSON.stringify(defaultRouteResponse, null, 2)}</pre>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}

                {apiGetInfoResponse ? (
                    <div className="border border-success mt-3 d-flex justify-content-start align-items-center p-3">
                        <p className="me-2">The route is : "/api/info"</p>
                        <pre className="mb-0 ms-3 border border-secondary p-2">{JSON.stringify(apiGetInfoResponse, null, 2)}</pre>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}  

                {apiVersionResponse ? (
                    <div className="border border-warning mt-3 d-flex justify-content-start align-items-center p-3">
                        <p className="me-2">The route is : "/api/version"</p>
                        <pre className="mb-0 ms-3 border border-secondary p-2">{JSON.stringify(apiVersionResponse, null, 2)}</pre>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </>
    )
}

export default BackendTest;