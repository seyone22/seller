export async function fetchItemsFromAPI(endpoint = 'item') {
    try {
        const response = await fetch(`/api/${endpoint}`);
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

export async function pushInvoiceToAPI(data) {
    try {
        const response = await fetch('/api/invoice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to post invoice data');
        }

        const responseData = await response.json();
        console.log('Invoice data posted successfully:', responseData);
        return responseData; // Return the response data
    } catch (error) {
        console.error('Error posting invoice data:', error);
        throw error; // Rethrow the error to be caught by the caller
    }
}