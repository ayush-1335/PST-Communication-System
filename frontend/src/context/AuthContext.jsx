import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true)
            try {
                const res = await fetch("http://localhost:8000/users/profile", {
                    method: "GET",
                    credentials: "include",
                });

                console.log("responce:", res)

                if (!res.ok) {
                    setUser(null);
                } else {
                    const data = await res.json();
                    setUser(data.data); // safeUser object
                }


            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const login = async (logindata) => {

        setLoading(true)

        try {
            const response = await fetch("http://localhost:8000/users/login",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(logindata)
                }
            )

            const data = await response.json()
            console.log("data", data)

            if (!data.success) {
                setUser(null)
                return {
                    success: false,
                    message: data.message
                };
            }

            setUser(data.data.safeUser);

            return { success: true };

        } catch (error) {
            return { success: false, message: error.message };
        } finally {
            setLoading(false);
        }

    }

        const logout = async () => {
            setLoading(true)

            try {
                const response = await fetch("http://localhost:8000/users/logout",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include"
                    }
                )

                const data = await response.json()

                if(data.success){
                    setUser(null)
                } else{
                    return { success: false, message: data.message || "Logout failed" };
                }

            } catch (error) {
                return { success: false, message: error.message };
            } finally {
                setLoading(false);
            }

        };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );

}

export const useAuth = () => useContext(AuthContext);