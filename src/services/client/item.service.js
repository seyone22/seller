export async function pushItemToAPI(data, endpoint = 'item') {
    try {
        const response = await fetch(`/api/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to post item!');
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        throw error;
    }
}