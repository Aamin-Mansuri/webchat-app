const mongoose = require('mongoose');
const dns = require('dns');

// Node's built-in DNS resolver sometimes fails SRV lookups
// (mongodb+srv://...) even when tools like Compass connect fine, because
// Compass/Chromium use a different resolution path than Node's c-ares
// resolver. This is a very common issue on Windows, some VPNs, and some
// home routers. Forcing IPv4 first and pointing at a public DNS server
// fixes it in the vast majority of cases.
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}
dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;