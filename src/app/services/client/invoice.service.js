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
        fetch('/api/invoice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to post invoice data');
                }
                return response.json();
            })
            .then(data => {
                console.log('Invoice data posted successfully:', data);
            })
            .catch(error => {
                console.error('Error posting invoice data:', error);
            });
    } catch (e) {
        console.log(e)
    }
}