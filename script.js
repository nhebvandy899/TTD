document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('login-section');
    const villageRegisterSection = document.getElementById('village-register-section');
    const adminRegisterSection = document.getElementById('admin-register-section');
    const showVillageRegisterLink = document.getElementById('show-village-register');
    const showAdminRegisterLink = document.getElementById('show-admin-register');
    const adminSetupLinkContainer = document.getElementById('admin-setup-link-container');
    const showLoginFromVillageLink = document.getElementById('show-login-from-village');
    const showLoginFromAdminLink = document.getElementById('show-login-from-admin');
    const loginForm = document.getElementById('login-form');
    const villageRegisterForm = document.getElementById('village-register-form');
    const adminRegisterForm = document.getElementById('admin-register-form');
    const loginErrorMsg = document.getElementById('login-error');
    const villageRegisterErrorMsg = document.getElementById('village-register-error');
    const villageRegisterSuccessMsg = document.getElementById('village-register-success');
    const adminRegisterErrorMsg = document.getElementById('admin-register-error');
    const adminRegisterSuccessMsg = document.getElementById('admin-register-success');

    const ADMIN_ACCOUNT_KEY = 'adminAccount_v2';
    const VILLAGES_KEY = 'registeredVillages_v2';
    const VILLAGE_DATA_KEY = 'villageData_v2';
    const VILLAGE_ACCESS_LOG_KEY = 'villageAccessLog_v2'; // Key for access log

    const getAdminAccount = () => {
        const account = localStorage.getItem(ADMIN_ACCOUNT_KEY);
        try { return account ? JSON.parse(account) : null; } catch (e) { console.error("Error parsing admin account",e); return null; }
    };
    const saveAdminAccount = (account) => localStorage.setItem(ADMIN_ACCOUNT_KEY, JSON.stringify(account));
    const getRegisteredVillages = () => {
        const villages = localStorage.getItem(VILLAGES_KEY);
        try { const parsed = JSON.parse(villages); return typeof parsed === 'object' && parsed !== null ? parsed : {};}
        catch (e) { console.error("Error parsing registered villages",e); return {}; }
    };
    const saveRegisteredVillages = (villages) => {
        if (typeof villages === 'object' && villages !== null) localStorage.setItem(VILLAGES_KEY, JSON.stringify(villages));
    };
    const getVillageDataStorage = () => {
        const data = localStorage.getItem(VILLAGE_DATA_KEY);
        try { const parsed = JSON.parse(data); return typeof parsed === 'object' && parsed !== null ? parsed : {};}
        catch (e) { console.error("Error parsing village data",e); return {}; }
    };
    const saveVillageDataStorage = (data) => {
         if (typeof data === 'object' && data !== null) localStorage.setItem(VILLAGE_DATA_KEY, JSON.stringify(data));
    };

    if (!getAdminAccount() && adminSetupLinkContainer) {
        adminSetupLinkContainer.style.display = 'block';
    }

    const showOnly = (sectionToShow) => {
        [loginSection, villageRegisterSection, adminRegisterSection].forEach(section => {
            if (section) section.style.display = (section === sectionToShow) ? 'block' : 'none';
        });
        [loginErrorMsg, villageRegisterErrorMsg, villageRegisterSuccessMsg, adminRegisterErrorMsg, adminRegisterSuccessMsg].forEach(msg => {
            if(msg) msg.textContent = '';
        });
        if(loginForm) loginForm.reset();
        if(villageRegisterForm) villageRegisterForm.reset();
        if(adminRegisterForm) adminRegisterForm.reset();
    };

    if(showVillageRegisterLink) showVillageRegisterLink.addEventListener('click', (e) => { e.preventDefault(); showOnly(villageRegisterSection); });
    if(showAdminRegisterLink) showAdminRegisterLink.addEventListener('click', (e) => { e.preventDefault(); showOnly(adminRegisterSection); });
    if(showLoginFromVillageLink) showLoginFromVillageLink.addEventListener('click', (e) => { e.preventDefault(); showOnly(loginSection); });
    if(showLoginFromAdminLink) showLoginFromAdminLink.addEventListener('click', (e) => { e.preventDefault(); showOnly(loginSection); });

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if(loginErrorMsg) loginErrorMsg.textContent = '';
            const usernameOrVillage = document.getElementById('login-username-village').value.trim();
            const password = document.getElementById('login-password').value;

            if (!usernameOrVillage || !password) {
                if(loginErrorMsg) loginErrorMsg.textContent = 'សូមបញ្ចូលឈ្មោះអ្នកប្រើ/ភូមិ និងលេខសម្ងាត់។';
                return;
            }
            const adminAcc = getAdminAccount();
            if (adminAcc && usernameOrVillage === adminAcc.username && password === adminAcc.password) {
                sessionStorage.setItem('loggedInUserType', 'admin');
                sessionStorage.setItem('loggedInUsername', adminAcc.username);
                sessionStorage.removeItem('loggedInVillage');
                window.location.href = 'admin_dashboard.html';
                return;
            }
            const villages = getRegisteredVillages();
            if (villages.hasOwnProperty(usernameOrVillage) && villages[usernameOrVillage].password === password) {
                sessionStorage.setItem('loggedInUserType', 'village');
                sessionStorage.setItem('loggedInVillage', usernameOrVillage);
                sessionStorage.removeItem('loggedInUsername');

                // Log Village Chief Access
                let accessLog = [];
                const storedLog = localStorage.getItem(VILLAGE_ACCESS_LOG_KEY);
                if (storedLog) {
                    try { accessLog = JSON.parse(storedLog); if (!Array.isArray(accessLog)) accessLog = []; }
                    catch (e) { console.error("Error parsing village access log:", e); accessLog = []; }
                }
                accessLog.push({
                    villageName: usernameOrVillage,
                    accessTime: new Date().toISOString(),
                    userAgent: navigator.userAgent
                });
                if (accessLog.length > 50) accessLog = accessLog.slice(accessLog.length - 50);
                localStorage.setItem(VILLAGE_ACCESS_LOG_KEY, JSON.stringify(accessLog));

                window.location.href = 'dashboard.html';
                return;
            }
            if(loginErrorMsg) loginErrorMsg.textContent = 'ឈ្មោះអ្នកប្រើ/ភូមិ ឬលេខសម្ងាត់មិនត្រឹមត្រូវ។';
        });
    }

    if (villageRegisterForm) {
        villageRegisterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if(villageRegisterErrorMsg) villageRegisterErrorMsg.textContent = '';
            if(villageRegisterSuccessMsg) villageRegisterSuccessMsg.textContent = '';
            const villageName = document.getElementById('register-village-name').value.trim();
            const phone = document.getElementById('register-village-phone').value.trim();
            const password = document.getElementById('register-village-password').value;
            const confirmPassword = document.getElementById('register-village-confirm-password').value;

            if (!villageName || !phone || !password || !confirmPassword) {
                if(villageRegisterErrorMsg) villageRegisterErrorMsg.textContent = 'សូមបំពេញគ្រប់ប្រអប់។'; return;
            }
            if (password.length < 6) {
                if(villageRegisterErrorMsg) villageRegisterErrorMsg.textContent = 'លេខសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួអក្សរ។'; return;
            }
            if (password !== confirmPassword) {
                if(villageRegisterErrorMsg) villageRegisterErrorMsg.textContent = 'លេខសម្ងាត់ និងការបញ្ជាក់លេខសម្ងាត់មិនដូចគ្នា។'; return;
            }
            const adminAcc = getAdminAccount();
            if (adminAcc && villageName.toLowerCase() === adminAcc.username.toLowerCase()){
                if(villageRegisterErrorMsg) villageRegisterErrorMsg.textContent = `"${villageName}" គឺជាឈ្មោះដែលបានប្រើសម្រាប់ Admin។ សូមជ្រើសរើសឈ្មោះផ្សេង។`; return;
            }
            const villages = getRegisteredVillages();
            if (villages.hasOwnProperty(villageName)) {
                if(villageRegisterErrorMsg) villageRegisterErrorMsg.textContent = `ភូមិ "${villageName}" បានចុះឈ្មោះរួចហើយ។`; return;
            }
            villages[villageName] = {
                phone: phone,
                password: password,
                canEditData: false
            };
            saveRegisteredVillages(villages);
            const villageData = getVillageDataStorage();
            if (!villageData.hasOwnProperty(villageName)) {
                villageData[villageName] = [];
                saveVillageDataStorage(villageData);
            }
            if(villageRegisterSuccessMsg) villageRegisterSuccessMsg.textContent = 'ការចុះឈ្មោះមេភូមិបានជោគជ័យ! សូមចូលប្រើប្រាស់។';
            villageRegisterForm.reset();
            setTimeout(() => { showOnly(loginSection); }, 2500);
        });
    }

    if (adminRegisterForm) {
        adminRegisterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if(adminRegisterErrorMsg) adminRegisterErrorMsg.textContent = '';
            if(adminRegisterSuccessMsg) adminRegisterSuccessMsg.textContent = '';
            if (getAdminAccount()) {
                if(adminRegisterErrorMsg) adminRegisterErrorMsg.textContent = 'គណនី Admin ត្រូវបានបង្កើតរួចហើយ។';
                if(adminSetupLinkContainer) adminSetupLinkContainer.style.display = 'none';
                return;
            }
            const adminUsername = document.getElementById('register-admin-username').value.trim();
            const adminPassword = document.getElementById('register-admin-password').value;
            const adminConfirmPassword = document.getElementById('register-admin-confirm-password').value;
            if (!adminUsername || !adminPassword || !adminConfirmPassword) {
                if(adminRegisterErrorMsg) adminRegisterErrorMsg.textContent = 'សូមបំពេញគ្រប់ប្រអប់។'; return;
            }
            if (adminPassword.length < 6) {
                if(adminRegisterErrorMsg) adminRegisterErrorMsg.textContent = 'លេខសម្ងាត់ Admin ត្រូវមានយ៉ាងតិច ៦ តួអក្សរ។'; return;
            }
            if (adminPassword !== adminConfirmPassword) {
                if(adminRegisterErrorMsg) adminRegisterErrorMsg.textContent = 'លេខសម្ងាត់ និងការបញ្ជាក់លេខសម្ងាត់មិនដូចគ្នា។'; return;
            }
            const villages = getRegisteredVillages();
            if (villages.hasOwnProperty(adminUsername)) {
                 if(adminRegisterErrorMsg) adminRegisterErrorMsg.textContent = `ឈ្មោះអ្នកប្រើ "${adminUsername}" កំពុងត្រូវបានប្រើប្រាស់ដោយភូមិមួយ។ សូមជ្រើសរើសឈ្មោះផ្សេង។`; return;
            }
            saveAdminAccount({ username: adminUsername, password: adminPassword });
            if(adminRegisterSuccessMsg) adminRegisterSuccessMsg.textContent = 'គណនី Admin ដំបូងត្រូវបានបង្កើតដោយជោគជ័យ! សូមចូលប្រើប្រាស់។';
            adminRegisterForm.reset();
            if(adminSetupLinkContainer) adminSetupLinkContainer.style.display = 'none';
            setTimeout(() => { showOnly(loginSection); }, 2500);
        });
    }
    showOnly(loginSection);
});