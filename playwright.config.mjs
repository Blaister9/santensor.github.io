import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests/browser',workers:1,retries:0,reporter:[['list'],['json',{outputFile:'evidence/browser-results.json'}]],use:{baseURL:process.env.SITE_TEST_URL??'http://127.0.0.1:4173'},webServer:process.env.SITE_TEST_URL?undefined:{command:'npm run preview',url:'http://127.0.0.1:4173',reuseExistingServer:true}});
