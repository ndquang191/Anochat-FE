"use client";

import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";

const USER_STORAGE_KEY = "user_data";

export interface UserData extends User {
	user_metadata: {
		name?: string;
		age?: number;
		city?: string;
		isPublic?: boolean;
	};
	profile?: {
		id: string;
		nickname: string;
		gender: string;
		name: string;
		address: string;
		is_visible: boolean;
		chat_type?: string;
		created_at: string;  
		
	};
}

export function useUser() {
	const [user, setUser] = useState<UserData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const supabase = createClient();

				// Get auth user first
				const { data: authData } = await supabase.auth.getUser();
				if (!authData?.user?.id) {
					setUser(null);
					setLoading(false);
					return;
				}

				// Then query additional info from users table
				const { data: profile, error: profileError } = await supabase
					.from("users")
					.select("*")
					.eq("id", authData.user.id)
					.single();

				if (profileError) throw profileError;

				// Merge auth user and profile data
				const userData: UserData = {
					...authData.user,
					profile: profile,
				};

				// Save to localStorage and state
				localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
				setUser(userData);
			} catch (err) {
				setError(err instanceof Error ? err : new Error("Unknown error"));
				console.error("Error fetching user data:", err);
			} finally {
				setLoading(false);
			}
		};

		// Try to load from localStorage first
		const storedUser = localStorage.getItem(USER_STORAGE_KEY);
		if (storedUser) {
			setUser(JSON.parse(storedUser));
			setLoading(false);
		}

		// Then fetch fresh data
		fetchUser();
	}, []);

	const saveUser = async (userData: UserData) => {
		try {
			const supabase = createClient();

			// Update user metadata in auth
			const { error: metadataError } = await supabase.auth.updateUser({
				data: userData.user_metadata,
			});

			if (metadataError) throw metadataError;

			// Update profile in users table
			if (userData.profile) {
				const { error: profileError } = await supabase
					.from("users")
					.update({
						name: userData.profile.name,
						is_visible: userData.profile.is_visible,
						chat_type: userData.profile.chat_type,
					})
					.eq("id", userData.id);

				if (profileError) throw profileError;
			}

			// Save to localStorage and state
			localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
			setUser(userData);
		} catch (err) {
			setError(err instanceof Error ? err : new Error("Failed to save user data"));
			console.error("Error saving user data:", err);
			throw err; // Re-throw to handle in the component
		}
	};

	const clearUser = () => {
		localStorage.removeItem(USER_STORAGE_KEY);
		setUser(null);
		setError(null);
	};

	return { user, loading, error, saveUser, clearUser };
}
