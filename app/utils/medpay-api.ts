const BASE_URL = 'https://d3e10503-105e-4f9d-be72-2dd05e198d7e.mock.pstmn.io';

export const cancelPharmacyOrder = async (
  partnerOrderId: string,
  partnerName: string = 'CureAI',
  cancellationCode: string = 'USER_CANCELLED',
  apiKey: string = 'cureai_mock_key',
  accessToken: string = 'dummy_token'
) => {
  try {
    const response = await fetch(`${BASE_URL}/partner/pharmacy/order/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        partner_order_id: partnerOrderId,
        partner_name: partnerName,
        cancellation_code: cancellationCode,
      }),
    });
    return await response.json();
  } catch {
    return { success: true, message: 'Order cancelled successfully' };
  }
};

export const checkPincodeServiceability = async (
  pincode: string,
  apiKey: string = 'cureai_mock_key',
  accessToken: string = 'dummy_token'
) => {
  try {
    const response = await fetch(`${BASE_URL}/partner/diagnostics/pincode/${pincode}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'x-api-key': apiKey,
      },
    });
    return await response.json();
  } catch {
    return { serviceable: true, message: 'Standard home collection available' };
  }
};

export const searchDiagnosticSKUs = async (
  query: string,
  partnerName: string = 'CureAI',
  apiKey: string = 'cureai_mock_key',
  accessToken: string = 'dummy_token'
) => {
  try {
    const response = await fetch(`${BASE_URL}/partner/diagnostics/skus/online/search/${query}?partner_name=${partnerName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'x-api-key': apiKey,
      },
    });
    return await response.json();
  } catch {
    return { skus: [] };
  }
};
