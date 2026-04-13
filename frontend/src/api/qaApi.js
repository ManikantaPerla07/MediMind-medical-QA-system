import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:7860';

const api = axios.create({
	baseURL,
});

export async function askQuestion(question) {
	try {
		const response = await api.post('/predict', { question });
		return response.data;
	} catch (error) {
		const message = error?.response?.data?.message || error?.message || 'Request failed';
		throw new Error(message);
	}
}

export async function checkHealth() {
	try {
		const response = await api.get('/health');
		return response.data;
	} catch {
		return null;
	}
}
