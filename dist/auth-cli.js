#!/usr/bin/env node
/**
 * CLI tool to manually trigger authentication.
 * Run this first to log in and save session.
 * Usage: npm run auth
 */
import { getToken, getTokenExpiry } from './auth.js';
async function main() {
    console.log('Starting D2L authentication...');
    console.log('A browser window will open. Please log in to Brightspace.');
    console.log('');
    try {
        const token = await getToken();
        const expiry = new Date(getTokenExpiry());
        console.log('');
        console.log('Authentication successful!');
        console.log(`Token expires at: ${expiry.toLocaleString()}`);
        console.log('');
        console.log('Your session has been saved. The MCP server will use it automatically.');
        console.log('Token (first 50 chars):', token.substring(0, 50) + '...');
    }
    catch (error) {
        console.error('Authentication failed:', error);
        process.exit(1);
    }
}
main();
