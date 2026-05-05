"use client";

import { ReactNode, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useRouter } from "next/navigation";



interface props {
    children : ReactNode;
}

export default function ProtectedRoute({children} : props){
    const {user,loading,fetchMe} = useAuthStore();
    const router = useRouter();


    useEffect(() => {
      fetchMe();
    },[fetchMe]);


   useEffect(() => {
  if (!loading && !user) {
    router.replace("/login");
  }
}, [user, loading, router]);



    if (loading)
        return (
      <div className="flex items-center justify-center min-h-screen bg-orange-950 text-white">
        Loading...
      </div>
        )

        if(!user){
          return null;
        }

    return <>{children}</>

}