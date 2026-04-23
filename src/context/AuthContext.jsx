import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { supabase } from "../lib/supabase";
import { useContext } from "react";


const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchProfile = async (userid) => {

        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userid)
            .maybeSingle();
        
        if(error) {
            console.error("PROFILE ERROR:", error.message);
        }
        return data

        setLoading(false);
        return data;
    };

    const handleRoleChange = async (role) => {
        if(role.trim() == "") return

        const { data, error } = await supabase.from("profiles").update({ role }).eq("id", user.id)

        if(error) console.log(error);
        console.log(data);

        setLoading(false)

    }

    useEffect(() => {
        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {

                setUser(session?.user ?? null)
                setLoading(false)
            }
        )

        return () => {
            listener.subscription.unsubscribe()
        }
    }, [])

    const handleSignup = async (name, email, password) => {
        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if(error) {
            alert(error.message);
            setLoading(false);
            return;
        }

        const user = data?.user;

        if(!user) {
            console.log("No user returned");
            setLoading(false);
            return;
        }

        // 🔥 INSERT PROFILE (with error handling)
        const { error: profileError } = await supabase
            .from("profiles")
            .insert({
                id: user.id,
                name,
                email,
                role: "customer",
            });

        if(profileError) {
            console.error("Profile insert error:", profileError.message);
            alert(profileError.message);
        }

        setUser(user);
        setLoading(false);
    };



    // ✅ Login
    const handleLogin = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        if(error) alert(error.message)
        if(data.user) setUser(data.user)
        setLoading(false)
    }

    // ✅ Logout
    const handleLogout = async () => {
        await supabase.auth.signOut()
    }

    return (
        <AuthContext.Provider value={{ user, loading, handleLogin, handleSignup, handleLogout, fetchProfile, handleRoleChange }}>
            {children}
        </AuthContext.Provider>
    )
}


export const useAuth = () => useContext(AuthContext)