const PAYMOB_API_BASE = "https://accept.paymob.com/api";

export async function getPaymobAuthToken() {
  const response = await fetch(`${PAYMOB_API_BASE}/auth/tokens`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: process.env.PAYMOB_API_KEY }),
  });

  const data = await response.json();
  return data.token;
}

export async function createPaymobOrder(authToken: string, amountCents: number, courseId: string, userId: string) {
  const response = await fetch(`${PAYMOB_API_BASE}/ecommerce/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      auth_token: authToken,
      delivery_needed: "false",
      amount_cents: amountCents,
      currency: "EGP",
      items: [
        {
          name: courseId,
          amount_cents: amountCents,
          description: `Enrollment for course ${courseId}`,
          quantity: "1",
        },
      ],
      shipping_data: {
          // Required by Paymob even if delivery_needed is false
          first_name: "User",
          last_name: userId,
          email: "user@example.com",
          phone_number: "01000000000",
          extra_description: userId // We will use this to identify the user in callback
      }
    }),
  });

  const data = await response.json();
  return data.id;
}

export async function generatePaymentKey(
  authToken: string,
  orderId: number,
  amountCents: number,
  integrationId: string,
  billingData: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
  }
) {
  const response = await fetch(`${PAYMOB_API_BASE}/acceptance/payment_keys`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      auth_token: authToken,
      amount_cents: amountCents,
      expiration: 3600,
      order_id: orderId,
      billing_data: {
        ...billingData,
        apartment: "NA",
        floor: "NA",
        street: "NA",
        building: "NA",
        shipping_method: "NA",
        postal_code: "NA",
        city: "NA",
        country: "NA",
        state: "NA",
      },
      currency: "EGP",
      integration_id: integrationId,
    }),
  });

  const data = await response.json();
  return data.token;
}
