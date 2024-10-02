import { useMutation,useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useUpdateUserProfile=()=>{
    const queryClient=useQueryClient();

    const {mutate:updateProfile,isPending:isUpdatingProfile}=useMutation({
		mutationFn:async (formData)=>{
			try {
				console.log(formData);
				const res=await fetch("/api/users/update",{
					method:"Post",
					headers: {
						"Content-Type": "application/json",
					},
                    body: JSON.stringify(formData),
				});
				const data=await res.json();
				if(!res.ok) throw new Error(data.error || "Something went wrong");
				return data;

			} catch (error) {
				throw new Error(error.message);
			}
		},
		onSuccess :()=>{
			toast.success("Profile update successfully");
			Promise.all([
				queryClient.invalidateQueries({queryKey:["authUser"]}),
				queryClient.invalidateQueries({queryKey:["userProfile"]})
			]);
		},
		onError:(error)=>{
			toast.error(error.message);
		}
	});
	
    return {updateProfile,isUpdatingProfile};
};
export default useUpdateUserProfile;