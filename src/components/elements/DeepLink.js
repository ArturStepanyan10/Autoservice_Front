import { Linking } from 'react-native';
import {useEffect} from 'react';

Linking.addEventListener('url', handleDeepLink);

function handleDeepLink(event) {
    const linking = {
        prefixes: ["myapp://app"],
        config: {
            screens: {
                ResetPassword: "reset-password/:uid/:token",
            },
        },
    };
}

useEffect(() => {
        const handleDeepLink = (event) => {
            const { url } = event;
            console.log("Deep link received: ", url);
        };

        Linking.addEventListener("url", handleDeepLink);

        return () => {
            Linking.removeEventListener("url", handleDeepLink);
        };
    }, []);


