export async function fetchInvoicesFromAPI(endpoint = 'invoice', date = 'today') {
    try {
        let type = ""
        const response = await fetch(`/api/${endpoint}?date=${date}`);
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

export async function fetchInvoiceFromAPI(id = "") {
    try {
        const invoices = await fetchInvoicesFromAPI('invoice', 'all');

        return invoices.find(invoice => invoice._id === id);
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

export async function pushInvoiceToAPI(data,endpoint = 'invoice') {
    try {
        const response = await fetch(`/api/${endpoint}`, {
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

export async function fetchStatisticsFromAPI(range = 'all', endpoint = 'sales/statistics') {
    try {
        const response = await fetch(`/api/${endpoint}?range=${range}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error('Error fetching data from server');
        }

        const responseData = await response.json();
        console.log(responseData);
        return responseData['data'];
    } catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}


export const sendReceiptEmail = async (invoiceData) => {
    try {
        const response = await fetch('/api/invoice/send_mail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(invoiceData),
        });

        const result = await response.json();
        if (result.success) {
            console.log('Receipt sent successfully');
            return true;
        } else {
            console.error('Failed to send receipt:', result.error);
            return false;
        }


    } catch (error) {
        console.error('Error:', error);
        return false;
    }
};