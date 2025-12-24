
async function main() {
    const baseUrl = "https://mqudah.com/api";
    const email = `live_test_${Date.now()}@mqudah.com`;
    const password = "LiveStrongPassword2025!";

    console.log(`Checking Live Site: ${baseUrl}`);

    // 1. Register
    console.log(`\n1. Registering ${email}...`);
    const reg = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Live Tester", email, password })
    });

    if (reg.ok) {
        const data = await reg.json();
        console.log("Response Body:", JSON.stringify(data, null, 2));
        if (data.user) {
            console.log(`User ID: ${data.user.id}, Role: ${data.user.role}`);
        } else {
            console.log("⚠️ No user object in response!");
        }
    } else {
        console.log("❌ Register Failed:", reg.status, await reg.text());
        return; // Stop if register fails
    }

    // 2. Login
    console.log(`\n2. Logging in...`);
    const login = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    if (login.ok) {
        const data = await login.json();
        console.log("✅ Login Success!");
        console.log("Access Token received.");
    } else {
        console.log("❌ Login Failed:", login.status, await login.text());
    }

    // 3. Admin Login Check
    console.log(`\n3. Checking Admin Login (admin_e2e@mqudah.com)...`);
    const adminLogin = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "admin_e2e@mqudah.com", password: "MqudahAdmin2025!" })
    });

    if (adminLogin.ok) {
        const data = await adminLogin.json();
        console.log("✅ Admin Login Success!", data.user ? `Role: ${data.user.role}` : "Token Auth OK");
    } else {
        console.log("❌ Admin Login Failed:", adminLogin.status, await adminLogin.text());
    }
}

main();
