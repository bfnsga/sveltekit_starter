// Load
export const load = async ({ fetch }) => {
	// Fetch
	const res = await fetch('/api/api_keys');

	if (!res.ok) {
		console.log('response not okay');
	}

	// Payload
	const { data } = await res.json();

	// Return
	return {
		apiKeys: data
	};
};