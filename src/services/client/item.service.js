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

        return await response.json();
    } catch (error) {
        throw error;
    }
}

export async function fetchItemsFromAPI(endpoint = 'item', showActiveOnly = false) {
    try {
        let type
        if (showActiveOnly) { type = "active"} else { type = "all" }
        const response = await fetch(`/api/${endpoint}?type=${type}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const data = await response.json();
        return data['data'];
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

export const updateItem = async (updatedItem, id) => {
    try {
        const response = await fetch(`/api/item?id=${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedItem),
        });
        return await response.json();
    } catch (error) {
        return { success: false, error: error.message };
    }
};
