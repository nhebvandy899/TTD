// admin_script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Early check and DOM References ---
    const userType = sessionStorage.getItem('loggedInUserType');
    const adminUsernameFromSession = sessionStorage.getItem('loggedInUsername');

    if (userType !== 'admin' || !adminUsernameFromSession) {
        alert('សូមចូលប្រើជា Admin ជាមុនសិន!');
        sessionStorage.clear(); window.location.href = 'index.html'; return;
    }
    const adminId = `admin:${adminUsernameFromSession}`;

    const welcomeMessage = document.getElementById('welcome-message');
    const adminCurrentDateTimeDisplay = document.getElementById('admin-current-date-time');
    const logoutButton = document.getElementById('logout-button');
    const villageTableBody = document.getElementById('village-table-body');
    const villageSelect = document.getElementById('village-select');
    const totalFamiliesAdminSpan = document.getElementById('total-families-admin');
    const totalPeopleAdminSpan = document.getElementById('total-people-admin');
    const totalFemalesAdminSpan = document.getElementById('total-females-admin');
    const totalVillagesAdminSpan = document.getElementById('total-villages-admin');
    const totalInternalMigrantsAdminSpan = document.getElementById('total-internal-migrants-admin');
    const totalExternalMigrantsAdminSpan = document.getElementById('total-external-migrants-admin');
    const totalInternalMigrantsFemaleAdminSpan = document.getElementById('total-internal-migrants-female-admin');
    const totalExternalMigrantsFemaleAdminSpan = document.getElementById('total-external-migrants-female-admin');

    const ageGroup0_2_AdminSpan = document.getElementById('age-group-0-2-admin');
    const ageGroup0_2_Female_AdminSpan = document.getElementById('age-group-0-2-female-admin');
    const ageGroup3_4_AdminSpan = document.getElementById('age-group-3-4-admin');
    const ageGroup3_4_Female_AdminSpan = document.getElementById('age-group-3-4-female-admin');
    const ageGroup5_5_AdminSpan = document.getElementById('age-group-5-5-admin');
    const ageGroup5_5_Female_AdminSpan = document.getElementById('age-group-5-5-female-admin');
    const ageGroup6_6_AdminSpan = document.getElementById('age-group-6-6-admin');
    const ageGroup6_6_Female_AdminSpan = document.getElementById('age-group-6-6-female-admin');
    const ageGroup7_11_AdminSpan = document.getElementById('age-group-7-11-admin');
    const ageGroup7_11_Female_AdminSpan = document.getElementById('age-group-7-11-female-admin');
    const ageGroup12_14_AdminSpan = document.getElementById('age-group-12-14-admin');
    const ageGroup12_14_Female_AdminSpan = document.getElementById('age-group-12-14-female-admin');
    const ageGroup15_17_AdminSpan = document.getElementById('age-group-15-17-admin');
    const ageGroup15_17_Female_AdminSpan = document.getElementById('age-group-15-17-female-admin');
    const ageGroup18_24_AdminSpan = document.getElementById('age-group-18-24-admin');
    const ageGroup18_24_Female_AdminSpan = document.getElementById('age-group-18-24-female-admin');
    const ageGroup25_35_AdminSpan = document.getElementById('age-group-25-35-admin');
    const ageGroup25_35_Female_AdminSpan = document.getElementById('age-group-25-35-female-admin');
    const ageGroup36_45_AdminSpan = document.getElementById('age-group-36-45-admin');
    const ageGroup36_45_Female_AdminSpan = document.getElementById('age-group-36-45-female-admin');
    const ageGroup46_60_AdminSpan = document.getElementById('age-group-46-60-admin');
    const ageGroup46_60_Female_AdminSpan = document.getElementById('age-group-46-60-female-admin');
    const ageGroup61_Plus_AdminSpan = document.getElementById('age-group-61-plus-admin');
    const ageGroup61_Plus_Female_AdminSpan = document.getElementById('age-group-61-plus-female-admin');

    const eduLevelUneducatedAdminSpan = document.getElementById('edu-level-uneducated-admin');
    const eduLevelUneducatedFemaleAdminSpan = document.getElementById('edu-level-uneducated-female-admin');
    const eduLevelPrimaryAdminSpan = document.getElementById('edu-level-primary-admin');
    const eduLevelPrimaryFemaleAdminSpan = document.getElementById('edu-level-primary-female-admin');
    const eduLevelLowerSecondaryAdminSpan = document.getElementById('edu-level-lower-secondary-admin');
    const eduLevelLowerSecondaryFemaleAdminSpan = document.getElementById('edu-level-lower-secondary-female-admin');
    const eduLevelHighSchoolAdminSpan = document.getElementById('edu-level-high-school-admin');
    const eduLevelHighSchoolFemaleAdminSpan = document.getElementById('edu-level-high-school-female-admin');
    const eduLevelBachelorAdminSpan = document.getElementById('edu-level-bachelor-admin');
    const eduLevelBachelorFemaleAdminSpan = document.getElementById('edu-level-bachelor-female-admin');
    const eduLevelSkillAdminSpan = document.getElementById('edu-level-skill-admin');
    const eduLevelSkillFemaleAdminSpan = document.getElementById('edu-level-skill-female-admin');
    const eduLevelPostgraduateAdminSpan = document.getElementById('edu-level-postgraduate-admin');
    const eduLevelPostgraduateFemaleAdminSpan = document.getElementById('edu-level-postgraduate-female-admin');
    const eduLevelOtherAdminSpan = document.getElementById('edu-level-other-admin');
    const eduLevelOtherFemaleAdminSpan = document.getElementById('edu-level-other-female-admin');

    const adminAssetSummaryTbody = document.getElementById('admin-asset-summary-tbody');
    const selectedVillageNameH3 = document.getElementById('selected-village-name-admin');
    const familyListContainerAdmin = document.getElementById('family-list-container-admin');
    const noFamilyDataMessageAdmin = document.getElementById('no-family-data-message-admin');
    const familyCardTemplate = document.getElementById('family-card-template');
    const editFamilyModal = document.getElementById('edit-family-modal-admin');
    const closeEditFamilyModalButton = document.getElementById('close-edit-family-modal-admin');
    const editFamilyForm = document.getElementById('edit-family-form-admin');
    const editFamilyIdInput = document.getElementById('edit-family-id-admin');
    const editFamilyVillageInput = document.getElementById('edit-family-village-admin');
    const editFamilyHeadNameInput = document.getElementById('edit-family-head-name-admin');
    const editFamilyHeadPhoneAdminInput = document.getElementById('edit-family-head-phone-admin');
    const editFamilyMembersContainer = document.getElementById('edit-family-members-container-admin');
    const addMemberToEditFormButton = document.getElementById('add-member-to-edit-form-admin');
    const editFamilyAssetsContainer = document.getElementById('edit-family-assets-container-admin');
    const editMemberTemplateAdmin = document.getElementById('edit-member-template-admin');
    const editFamilyErrorAdmin = document.getElementById('edit-family-error-admin');
    const editFamilySuccessAdmin = document.getElementById('edit-family-success-admin');
    const reportDateSpan = document.getElementById('report-date');
    const generateDailyReportButton = document.getElementById('generate-daily-report');
    const dailyReportContentDiv = document.getElementById('daily-report-content');
    const searchFamilyInput = document.getElementById('search-family-input');
    const searchFamilyButton = document.getElementById('search-family-button');
    const activityLogTbody = document.getElementById('activity-log-tbody');

    // --- Messaging DOM References ---
    const adminBellMailboxButton = document.getElementById('admin-bell-mailbox-button');
    const adminUnreadBellCountSpan = document.getElementById('admin-unread-bell-count');
    const messageModalAdmin = document.getElementById('message-modal-admin');
    const closeMessageModalAdminButton = document.getElementById('close-message-modal-admin');
    const messageModalTitleAdmin = document.getElementById('message-modal-title-admin');
    const messageHistoryAdminDiv = document.getElementById('message-history-admin');
    const messageComposerAdminDiv = document.getElementById('message-composer-admin');
    const messageRecipientAdminIdInput = document.getElementById('message-recipient-admin-id');
    const messageInputAdmin = document.getElementById('message-input-admin');
    const sendMessageButtonAdmin = document.getElementById('send-message-button-admin');
    const messageErrorAdmin = document.getElementById('message-error-admin');
    // Image related DOM elements for Admin
    const imageInputAdmin = document.getElementById('image-input-admin');
    const imagePreviewAdmin = document.getElementById('image-preview-admin');
    const removeImageAdminButton = document.getElementById('remove-image-admin');
    let selectedImageBase64Admin = null; // To store the selected image data for admin

    const MAX_MEMBERS_EDIT = 9;
    const { jsPDF } = window.jspdf;

    const khmerOSBattambangBase64 = 'YOUR_KHMER_OS_BATTAMBANG_BASE64_STRING_HERE';
    const FONT_FILENAME_VFS = "KhmerOSBattambang-Regular.ttf";
    const FONT_NAME_JSPDF = "KhmerOSBattambangAdmin";
    let khmerFontForAdminPDFLoaded = false;

    async function loadKhmerFont(doc) {
        if (khmerFontForAdminPDFLoaded && doc.getFont().fontName.toLowerCase() === FONT_NAME_JSPDF.toLowerCase()) {
            doc.setFont(FONT_NAME_JSPDF); return;
        }
        khmerFontForAdminPDFLoaded = false;
        try {
            const isValidBase64 = khmerOSBattambangBase64 && khmerOSBattambangBase64 !== 'YOUR_KHMER_OS_BATTAMBANG_BASE64_STRING_HERE' && khmerOSBattambangBase64.length > 1000;
            if (isValidBase64) {
                if (!doc.getFileFromVFS(FONT_FILENAME_VFS)) { doc.addFileToVFS(FONT_FILENAME_VFS, khmerOSBattambangBase64); }
                const fontList = doc.getFontList();
                if (!fontList[FONT_NAME_JSPDF]) { doc.addFont(FONT_FILENAME_VFS, FONT_NAME_JSPDF, "normal", "UTF-8");}
                doc.setFont(FONT_NAME_JSPDF); khmerFontForAdminPDFLoaded = true;
            } else {
                console.warn("Admin PDF: Khmer OS Battambang font Base64 string is missing, placeholder, or too short. PDF text might not render Khmer correctly. Falling back to helvetica.");
                doc.setFont("helvetica", "normal");
            }
        } catch (e) {
            console.error("Admin PDF: Error loading/setting Khmer font:", e); doc.setFont("helvetica", "normal");
        }
    }

    if (welcomeMessage) { welcomeMessage.textContent = `សូមស្វាគមន៍, ${adminUsernameFromSession}! (Admin)`; }
    const displayCurrentDateTimeForAdmin = () => {
        if (!adminCurrentDateTimeDisplay) return;
        const now = new Date();
        const daysKhmer = ["អាទិត្យ", "ច័ន្ទ", "អង្គារ", "ពុធ", "ព្រហស្បត្តិ៍", "សុក្រ", "សៅរ៍"];
        const monthsKhmer = ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"];
        const dayName = daysKhmer[now.getDay()]; const dayOfMonth = now.getDate();
        const monthName = monthsKhmer[now.getMonth()]; const year = now.getFullYear();
        let hours = now.getHours(); const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'ល្ងាច' : 'ព្រឹក'; hours = hours % 12; hours = hours ? hours : 12;
        const hoursStr = hours.toString();
        const timeString = `ម៉ោង ${hoursStr}:<span style="color:rgb(3, 20, 250);">${minutes}</span>:<span style="color:rgb(253, 8, 8);">${seconds}</span> ${ampm}`;
        adminCurrentDateTimeDisplay.innerHTML = `ថ្ងៃ${dayName} ទី${dayOfMonth} ខែ${monthName} ឆ្នាំ${year} ${timeString}`;
    };
    if (typeof displayCurrentDateTimeForAdmin === 'function') { displayCurrentDateTimeForAdmin(); setInterval(displayCurrentDateTimeForAdmin, 1000); }

    const VILLAGES_KEY = 'registeredVillages_v2';
    const VILLAGE_DATA_KEY = 'villageData_v2';
    const ACTIVITY_LOG_KEY = 'activityLog_v2';
    const MESSAGES_KEY = 'villageMessages_v1';

    const getRegisteredVillages = () => JSON.parse(localStorage.getItem(VILLAGES_KEY) || '{}');
    const getVillageDataStorage = () => JSON.parse(localStorage.getItem(VILLAGE_DATA_KEY) || '{}');
    const saveVillageDataStorage = (data) => localStorage.setItem(VILLAGE_DATA_KEY, JSON.stringify(data));
    const saveRegisteredVillages = (villages) => localStorage.setItem(VILLAGES_KEY, JSON.stringify(villages));
    const getMessages = () => { try { return JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]'); } catch (e) { console.error("Error parsing messages:", e); return []; }};
    const saveMessages = (messages) => localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));

    const assetFieldDefinitions = [
        {id: 'largeTrucks', label: 'រថយន្ដធំ', type: 'number'}, {id: 'smallCars', label: 'រថយន្តតូច', type: 'number'},
        {id: 'modifiedVehicles', label: 'រថយន្ដកែឆ្នៃ', type: 'number'}, {id: 'tractors', label: 'ត្រាក់ទ័រ', type: 'number'},
        {id: 'kubotas', label: 'គោយន្ដកន្ត្រៃ', type: 'number'}, {id: 'riceHarvesters', label: 'ម៉ាស៊ីនច្រូតស្រូវ', type: 'number'},
        {id: 'riceMills', label: 'ម៉ាស៊ីនកិនស្រូវ', type: 'number'}, {id: 'waterPumpsWells', label: 'អណ្ដូងស្នប់', type: 'number'},
        {id: 'ponds', label: 'ផ្ទះលក់ថ្នាំពេទ្យ(គ្រូពេទ្យ)', type: 'number'},
        {id: 'residentialLandSize', label: 'ទំហំដីលំនៅដ្ឋាន(ម៉ែត្រការ៉េ)', type: 'text', isLandArea: true},
        {id: 'paddyLandSize', label: 'ទំហំដីស្រែ', type: 'text', isLandArea: true},
        {id: 'plantationLandSize', label: 'ដីចំការ (ផ្សេងៗ)', type: 'text', isLandArea: true},
        {id: 'coconutLandSize', label: 'ដីចំការដូង', type: 'text', isLandArea: true},
        {id: 'mangoLandSize', label: 'ដីចំការស្វាយ', type: 'text', isLandArea: true},
        {id: 'cashewLandSize', label: 'ដីចំការស្វាយចន្ទី', type: 'text', isLandArea: true},
        {id: 'livestockLandSize', label: 'ដីចំការមាន់', type: 'text', isLandArea: true},
        {id: 'vehicleRepairShops', label: 'ជាងជួសជុល', type: 'number'}, {id: 'groceryStores', label: 'លក់ចាប់ហួយ', type: 'number'},
        {id: 'mobilePhoneShops', label: 'លក់ទូរស័ព្ទ', type: 'number'}, {id: 'constructionMaterialDepots', label: 'លក់គ្រឿងសំណង់', type: 'number'},
        {id: 'fuelDepots', label: 'ដេប៉ូប្រេង', type: 'number'}, {id: 'beautySalons', label: 'សម្អាងការ(សាឡន)', type: 'number'},
        {id: 'motorcycles', label: 'ម៉ូតូ', type: 'number'}, {id: 'tukTuks', label: 'ម៉ូតូកង់បី+ម៉ូតូសណ្ដោងរម៉ក់', type: 'number'},
        {id: 'remorques', label: 'ផ្ទះលក់គ្រឿងកសិកម្ម', type: 'number'}
    ];
    const memberFieldDefinitionsForEdit = [
        { classSuffix: 'name-edit', prop: 'name', label: 'ឈ្មោះ', required: true, type: 'text' },
        { classSuffix: 'gender-edit', prop: 'gender', label: 'ភេទ', type: 'select', options: [{value:'ប្រុស', text:'ប្រុស'}, {value:'ស្រី', text:'ស្រី'}] },
        { classSuffix: 'dob-edit', prop: 'dob', label: 'ថ្ងៃខែឆ្នាំកំណើត', type: 'date' },
        { classSuffix: 'birthProvince-edit', prop: 'birthProvince', label: 'ខេត្តកំណើត', type: 'text' },
        { classSuffix: 'educationLevel-edit', prop: 'educationLevel', label: 'កម្រិតវប្បធម៌', type: 'text' },
        { classSuffix: 'occupation-edit', prop: 'occupation', label: 'មុខរបរ', type: 'text' },
        { classSuffix: 'nationalId-edit', prop: 'nationalId', label: 'លេខអត្តសញ្ញាណប័ណ្ណ', type: 'text' },
        { classSuffix: 'electionOfficeId-edit', prop: 'electionOfficeId', label: 'លេខការិយាល័យបោះឆ្នោត', type: 'text' },
        { classSuffix: 'internalMigration-edit', prop: 'internalMigration', label: 'ចំណាកស្រុកក្នុង', type: 'select', options: [{value:'ទេ', text:'ទេ'}, {value:'បាទ', text:'បាទ'}] },
        { classSuffix: 'externalMigration-edit', prop: 'externalMigration', label: 'ចំណាកស្រុកក្រៅ', type: 'select', options: [{value:'ទេ', text:'ទេ'}, {value:'បាទ', text:'បាទ'}] }
    ];
    const trackedEducationLevels = {
        "មិនបានសិក្សា": "មិនបានសិក្សា", "បឋមសិក្សា": "បឋមសិក្សា (ថ្នាក់ទី ១-៦)",
        "អនុវិទ្យាល័យ": "អនុវិទ្យាល័យ (ថ្នាក់ទី ៧-៩)", "វិទ្យាល័យ": "វិទ្យាល័យ (ថ្នាក់ទី ១០-១២)",
        "បរិញ្ញាបត្រ": "បរិញ្ញាបត្រ", "ជំនាញ": "ជំនាញ",
        "លើសបរិញ្ញាបត្រ": "លើសបរិញ្ញាបត្រ", "ផ្សេងៗ": "ផ្សេងៗ"
    };
    const categorizeEducation = (levelText) => {
        if (!levelText || typeof levelText !== 'string') return "ផ្សេងៗ";
        const text = levelText.toLowerCase().trim();
        const normalizedText = text.replace(/១/g, '1').replace(/២/g, '2').replace(/៣/g, '3').replace(/៤/g, '4').replace(/៥/g, '5').replace(/៦/g, '6').replace(/៧/g, '7').replace(/៨/g, '8').replace(/៩/g, '9').replace(/១០/g, '10').replace(/១១/g, '11').replace(/១២/g, '12');
        if (normalizedText.includes("ជំនាញ") || normalizedText.includes("skill") || normalizedText.includes("vocational") || normalizedText.includes("វិជ្ជាជីវៈ")) return "ជំនាញ";
        if (normalizedText.includes("បរិញ្ញាបត្ររង") || normalizedText.includes("បរិញ្ញាប័ត្ររង") || normalizedText.includes("อนุปริญญา")) return "បរិញ្ញាបត្រ";
        if (normalizedText.includes("បរិញ្ញាបត្រ") || normalizedText.includes("បរិញ្ញាប័ត្រ") || normalizedText.includes("ปริญญาตรี")) return "បរិញ្ញាបត្រ";
        if (normalizedText.includes("អនុបណ្ឌិត") || normalizedText.includes("ปริญญาโท") || normalizedText.includes("postgraduate") || normalizedText.includes("master")) return "លើសបរិញ្ញាបត្រ";
        if (normalizedText.includes("បណ្ឌិត") || normalizedText.includes("ปริญญาเอก") || normalizedText.includes("doctorate") || normalizedText.includes("phd")) return "លើសបរិញ្ញាបត្រ";
        for (let i = 10; i <= 12; i++) { if (normalizedText.includes(`ថ្នាក់ទី${i}`) || normalizedText.includes(`ទី${i}`) || normalizedText.includes(`ថ្នាក់${i}`) || normalizedText.includes(`grade ${i}`)) return "វិទ្យាល័យ"; }
        if (normalizedText.includes("វិទ្យាល័យ") || normalizedText.includes("high school") || normalizedText.includes("បាក់ឌុប")) return "វិទ្យាល័យ";
        for (let i = 7; i <= 9; i++) { if (normalizedText.includes(`ថ្នាក់ទី${i}`) || normalizedText.includes(`ទី${i}`) || normalizedText.includes(`ថ្នាក់${i}`) || normalizedText.includes(`grade ${i}`)) return "អនុវិទ្យាល័យ"; }
        if (normalizedText.includes("អនុវិទ្យាល័យ") || normalizedText.includes("lower secondary") || normalizedText.includes("middle school")) return "អនុវិទ្យាល័យ";
        for (let i = 1; i <= 6; i++) { if (normalizedText.includes(`ថ្នាក់ទី${i}`) || normalizedText.includes(`ទី${i}`) || normalizedText.includes(`ថ្នាក់${i}`) || normalizedText.includes(`grade ${i}`)) return "បឋមសិក្សា"; }
        if (normalizedText.includes("បឋម") || normalizedText.includes("primary") || normalizedText.includes("elementary")) return "បឋមសិក្សា";
        if (normalizedText.includes("មិនបាន") || normalizedText.includes("អត់") || normalizedText.includes("none") || normalizedText.includes("no formal")) return "មិនបានសិក្សា";
        return "ផ្សេងៗ";
    };

    const calculateAge = (dobString) => {
        if (!dobString) return null; const birthDate = new Date(dobString);
        if (isNaN(birthDate.valueOf())) return null; const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) { age--;}
        return age;
    };
    const parseLandSize = (textValue) => {
        if (!textValue || typeof textValue !== 'string') return null; const cleanedValue = textValue.trim().toLowerCase();
        const numberMatch = cleanedValue.match(/(\d+(\.\d+)?)/); if (!numberMatch) return null;
        const value = parseFloat(numberMatch[0]); let unit = 'unknown';
        if (cleanedValue.includes('ហិចតា') || cleanedValue.includes('ហិកតា') || cleanedValue.includes('ha')) unit = 'hectare';
        else if (cleanedValue.includes('ម៉ែត្រការ៉េ') || cleanedValue.includes('m2')) unit = 'sqm';
        else if (cleanedValue.includes('អា') || cleanedValue.endsWith('a')) unit = 'are';
        else if (cleanedValue.match(/^(\d+(\.\d+)?)$/)) unit = 'hectare';
        return { value, unit };
    };
    const convertToHectares = (value, unit) => {
        if (isNaN(value)) return 0;
        switch (unit) {
            case 'hectare': return value; case 'sqm': return value / 10000;
            case 'are': return value / 100; case 'unknown': return value; default: return 0;
        }
    };

    // --- Messaging Functions for Admin ---
    const updateAdminUnreadCount = () => {
        if (!adminUnreadBellCountSpan) return;
        const allMessages = getMessages();
        const unread = allMessages.filter(msg => msg.to === adminId && !msg.readByReceiver).length;
        adminUnreadBellCountSpan.textContent = unread;
        adminUnreadBellCountSpan.style.display = unread > 0 ? 'inline-block' : 'none';
    };

    const markAdminMessagesAsRead = (senderVillageId) => {
        let messages = getMessages(); let changed = false;
        messages.forEach(msg => {
            if (msg.to === adminId && msg.from === senderVillageId && !msg.readByReceiver) {
                msg.readByReceiver = true; changed = true;
            }
        });
        if (changed) saveMessages(messages);
        updateAdminUnreadCount();
    };

    const displayAdminChatHistory = (villageId) => {
        if (!messageHistoryAdminDiv) return;
        messageHistoryAdminDiv.innerHTML = '';
        const allMessages = getMessages();
        const chatMessages = allMessages.filter(
            msg => (msg.from === adminId && msg.to === villageId) || (msg.from === villageId && msg.to === adminId)
        ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        if (chatMessages.length === 0) {
            messageHistoryAdminDiv.innerHTML = `<p style="text-align:center; color:#777;"><em>មិនមានសារក្នុងកិច្ចសន្ទនានេះទេ។</em></p>`;
            return;
        }
        chatMessages.forEach(msg => {
            const bubble = document.createElement('div');
            bubble.classList.add('message-bubble');
            bubble.classList.add(msg.from === adminId ? 'sent' : 'received');
            const senderNameDiv = document.createElement('div');
            senderNameDiv.classList.add('message-sender-name');
            senderNameDiv.textContent = msg.from === adminId ? adminUsernameFromSession : msg.from.split(':')[1];
            const contentDiv = document.createElement('div');
            contentDiv.classList.add('message-content');
            contentDiv.textContent = msg.content;
            bubble.appendChild(senderNameDiv);
            bubble.appendChild(contentDiv);
            if (msg.imageContent) { // Display image if present
                const imgElement = document.createElement('img');
                imgElement.src = msg.imageContent;
                imgElement.style.maxWidth = '100%'; imgElement.style.maxHeight = '200px';
                imgElement.style.borderRadius = '10px'; imgElement.style.marginTop = '5px';
                imgElement.alt = "រូបភាពដែលបានផ្ញើ";
                bubble.appendChild(imgElement);
            }
            const timestampDiv = document.createElement('div');
            timestampDiv.classList.add('message-timestamp');
            timestampDiv.textContent = new Date(msg.timestamp).toLocaleString('km-KH', { hour: '2-digit', minute: '2-digit', day: '2-digit', month:'short' });
            bubble.appendChild(timestampDiv);
            messageHistoryAdminDiv.appendChild(bubble);
        });
        messageHistoryAdminDiv.scrollTop = messageHistoryAdminDiv.scrollHeight;
        markAdminMessagesAsRead(villageId);
    };

    const displayAdminConversationList = () => {
        if (!messageHistoryAdminDiv || !messageComposerAdminDiv || !messageModalTitleAdmin) return;
        messageHistoryAdminDiv.innerHTML = ''; messageComposerAdminDiv.style.display = 'none';
        messageModalTitleAdmin.textContent = 'ប្រអប់សារ Admin - បញ្ជីសន្ទនា';
        const allMessages = getMessages(); const registeredVillagesObj = getRegisteredVillages();
        const conversationPartners = new Map();
        allMessages.forEach(msg => {
            let partnerId = null;
            if (msg.from.startsWith('village:') && msg.to === adminId) partnerId = msg.from;
            else if (msg.to.startsWith('village:') && msg.from === adminId) partnerId = msg.to;
            if (partnerId) {
                const currentLastTime = conversationPartners.get(partnerId) || 0;
                const messageTime = new Date(msg.timestamp).getTime();
                if (messageTime > currentLastTime) { conversationPartners.set(partnerId, messageTime); }
            }
        });
        Object.keys(registeredVillagesObj).forEach(villageName => {
            const villageId = `village:${villageName}`;
            if (!conversationPartners.has(villageId)) { conversationPartners.set(villageId, 0); }
        });
        if (conversationPartners.size === 0) {
            messageHistoryAdminDiv.innerHTML = `<p style="text-align:center; color:#777;"><em>មិនមានភូមិដើម្បីផ្ញើសារ។</em></p>`; return;
        }
        const sortedPartners = Array.from(conversationPartners.entries()).sort(([, timeA], [, timeB]) => timeB - timeA).map(([partnerId]) => partnerId);
        const ul = document.createElement('ul');
        sortedPartners.forEach(partnerId => {
            const villageName = partnerId.split(':')[1]; const li = document.createElement('li');
            const villageNameSpan = document.createElement('span'); villageNameSpan.textContent = `ភូមិ ${villageName}`;
            li.appendChild(villageNameSpan); li.dataset.villageId = partnerId;
            const unreadInConv = allMessages.filter(m => m.from === partnerId && m.to === adminId && !m.readByReceiver).length;
            if (unreadInConv > 0) {
                const unreadIndicator = document.createElement('span');
                unreadIndicator.classList.add('unread-indicator'); unreadIndicator.title = `${unreadInConv} សារមិនទាន់អាន`;
                li.appendChild(unreadIndicator);
            }
            li.onclick = () => {
                messageRecipientAdminIdInput.value = partnerId;
                messageModalTitleAdmin.textContent = `ផ្ញើសារទៅភូមិ ${villageName}`;
                displayAdminChatHistory(partnerId);
                messageComposerAdminDiv.style.display = 'block'; messageInputAdmin.value = ''; messageInputAdmin.focus();
            };
            ul.appendChild(li);
        });
        messageHistoryAdminDiv.appendChild(ul);
    };

    const openAdminMessageModal = (targetVillageName = null) => {
        if (!messageModalAdmin || !messageRecipientAdminIdInput || !messageModalTitleAdmin || !messageComposerAdminDiv) return;
        // Reset image selection when opening modal
        if (imageInputAdmin) imageInputAdmin.value = '';
        if (imagePreviewAdmin) imagePreviewAdmin.style.display = 'none';
        if (removeImageAdminButton) removeImageAdminButton.style.display = 'none';
        selectedImageBase64Admin = null;

        if (targetVillageName) {
            const villageId = `village:${targetVillageName}`;
            messageRecipientAdminIdInput.value = villageId;
            messageModalTitleAdmin.textContent = `ផ្ញើសារទៅភូមិ ${targetVillageName}`;
            displayAdminChatHistory(villageId);
            messageComposerAdminDiv.style.display = 'block'; messageInputAdmin.value = ''; messageInputAdmin.focus();
        } else {
            messageRecipientAdminIdInput.value = ''; displayAdminConversationList();
        }
        if(messageErrorAdmin) messageErrorAdmin.textContent = '';
        messageModalAdmin.style.display = 'block';
        updateAdminUnreadCount();
    };

    // Event listener for image input - ADMIN
    if (imageInputAdmin && imagePreviewAdmin && removeImageAdminButton) {
        imageInputAdmin.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                if (file.size > 3 * 1024 * 1024) { // 3MB limit
                    alert('រូបភាពធំពេក! សូមជ្រើសរើសរូបភាពតូចជាង 3MB។');
                    imageInputAdmin.value = ""; imagePreviewAdmin.style.display = 'none';
                    removeImageAdminButton.style.display = 'none'; selectedImageBase64Admin = null; return;
                }
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreviewAdmin.src = e.target.result; imagePreviewAdmin.style.display = 'block';
                    removeImageAdminButton.style.display = 'inline-block'; selectedImageBase64Admin = e.target.result;
                }
                reader.readAsDataURL(file);
            } else {
                imagePreviewAdmin.style.display = 'none'; removeImageAdminButton.style.display = 'none';
                selectedImageBase64Admin = null;
            }
        });
        removeImageAdminButton.addEventListener('click', () => {
            imageInputAdmin.value = ""; imagePreviewAdmin.src = "#"; imagePreviewAdmin.style.display = 'none';
            removeImageAdminButton.style.display = 'none'; selectedImageBase64Admin = null;
        });
    }

    if (sendMessageButtonAdmin) {
        sendMessageButtonAdmin.addEventListener('click', () => {
            if (!messageInputAdmin || !messageRecipientAdminIdInput) return;
            const content = messageInputAdmin.value.trim();
            const recipientId = messageRecipientAdminIdInput.value;
            if (!recipientId) { if(messageErrorAdmin) messageErrorAdmin.textContent = 'សូមជ្រើសរើសអ្នកទទួលសារពីបញ្ជី។'; return; }
            if (!content && !selectedImageBase64Admin) {
                if(messageErrorAdmin) messageErrorAdmin.textContent = 'ខ្លឹមសារសារ ឬរូបភាពមិនអាចទទេបានទេ។'; return;
            }
            const newMessage = {
                id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`, from: adminId, to: recipientId,
                content: content, imageContent: selectedImageBase64Admin, timestamp: new Date().toISOString(), readByReceiver: false
            };
            let messages = getMessages(); messages.push(newMessage); saveMessages(messages);
            messageInputAdmin.value = '';
            if (imageInputAdmin) imageInputAdmin.value = '';
            if (imagePreviewAdmin) imagePreviewAdmin.style.display = 'none';
            if (removeImageAdminButton) removeImageAdminButton.style.display = 'none';
            selectedImageBase64Admin = null;
            if(messageErrorAdmin) messageErrorAdmin.textContent = '';
            displayAdminChatHistory(recipientId);
        });
    }

    if (adminBellMailboxButton) { adminBellMailboxButton.addEventListener('click', () => openAdminMessageModal(null));}
    if (closeMessageModalAdminButton) {
        closeMessageModalAdminButton.onclick = () => {
            if (messageModalAdmin) messageModalAdmin.style.display = 'none';
            updateAdminUnreadCount();
        };
    }

    const loadRegisteredVillagesList = () => {
        if (!villageTableBody || !villageSelect) return;
        const registeredVillages = getRegisteredVillages();
        const villageNames = Object.keys(registeredVillages).sort();
        villageTableBody.innerHTML = '';
        villageSelect.innerHTML = '<option value="">-- ជ្រើសរើសភូមិ --</option>';
        if (villageNames.length === 0) {
            villageTableBody.innerHTML = '<tr><td colspan="4">មិនទាន់មានភូមិចុះឈ្មោះទេ។</td></tr>';
            villageSelect.disabled = true; return;
        }
        villageSelect.disabled = false;
        villageNames.forEach(name => {
            const villageInfo = registeredVillages[name];
            const row = villageTableBody.insertRow();
            row.insertCell().textContent = name;
            row.insertCell().textContent = villageInfo?.phone || 'N/A';
            const permissionCell = row.insertCell(); permissionCell.style.textAlign = 'center';
            const permissionButton = document.createElement('button');
            permissionButton.classList.add('permission-toggle-button'); permissionButton.dataset.villageName = name;
            permissionButton.textContent = villageInfo.canEditData ? 'បិទសិទ្ធិកែ' : 'បើកសិទ្ធិកែ';
            permissionButton.style.backgroundColor = villageInfo.canEditData ? '#28a745' : '#dc3545';
            permissionButton.onclick = () => toggleVillageEditPermission(name);
            permissionCell.appendChild(permissionButton);
            const actionCell = row.insertCell();
            const viewButton = document.createElement('button'); viewButton.textContent = 'មើល Dashboard';
            viewButton.onclick = () => { sessionStorage.setItem('adminViewingVillage', name); window.location.href = 'dashboard.html'; };
            actionCell.appendChild(viewButton);
            const messageButton = document.createElement('button'); messageButton.textContent = 'ផ្ញើសារ';
            messageButton.classList.add('message-village-button', 'action-button'); messageButton.dataset.villageName = name;
            messageButton.style.marginLeft = '5px'; messageButton.onclick = () => openAdminMessageModal(name);
            actionCell.appendChild(messageButton);
            const option = document.createElement('option'); option.value = name; option.textContent = name;
            villageSelect.appendChild(option);
        });
    };

    const toggleVillageEditPermission = (villageName) => {
        const registeredVillages = getRegisteredVillages();
        if (registeredVillages[villageName]) {
            registeredVillages[villageName].canEditData = !registeredVillages[villageName].canEditData;
            saveRegisteredVillages(registeredVillages); loadRegisteredVillagesList();
            alert(`សិទ្ធិកែសម្រួលសម្រាប់មេភូមិ "${villageName}" ត្រូវបាន ${registeredVillages[villageName].canEditData ? 'បើក' : 'បិទ'}។`);
        }
    };

    const printSingleFamilyDataToPDF = async (familyData, villageName) => {
        if (!familyData) { alert("មិនមានទិន្នន័យគ្រួសារសម្រាប់បោះពុម្ពទេ។"); return; }
        const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
        await loadKhmerFont(doc); let yPosition = 15; const lineHeight = 7; const indent = 15;
        const pageWidth = doc.internal.pageSize.getWidth(); const contentWidth = pageWidth - (indent * 2);
        doc.setFontSize(16); doc.setTextColor(0, 0, 0);
        doc.text(`បញ្ជីទិន្នន័យគ្រួសារ (Admin View)`, pageWidth / 2, yPosition, { align: 'center' }); yPosition += lineHeight * 1.5;
        doc.setFontSize(12); doc.text(`ឈ្មោះមេគ្រួសារ: ${familyData.familyName || 'N/A'}`, indent, yPosition); yPosition += lineHeight;
        doc.text(`ភូមិ: ${villageName || 'N/A'}`, indent, yPosition); yPosition += lineHeight;
        try { doc.text(`កាលបរិច្ឆេទបញ្ចូល: ${new Date(familyData.entryDate).toLocaleDateString('km-KH', { day: '2-digit', month: 'long', year: 'numeric' })}`, indent, yPosition);}
        catch { doc.text(`កាលបរិច្ឆេទបញ្ចូល: មិនត្រឹមត្រូវ`, indent, yPosition);} yPosition += lineHeight;
        if (familyData.headOfHouseholdPhone) { doc.text(`លេខទូរស័ព្ទមេគ្រួសារ: ${familyData.headOfHouseholdPhone}`, indent, yPosition); yPosition += lineHeight;}
        if (familyData.lastModifiedByAdmin) { doc.text(`កែសម្រួលចុងក្រោយដោយ Admin: ${familyData.lastModifiedByAdmin} (${familyData.lastModifiedDate ? new Date(familyData.lastModifiedDate).toLocaleString('km-KH', { day:'2-digit', month:'2-digit', year:'numeric', hour: '2-digit', minute:'2-digit', hour12: true }) : 'N/A'})`, indent, yPosition); yPosition += lineHeight;}
        else if (familyData.lastModifiedBy) { doc.text(`កែសម្រួលចុងក្រោយដោយ: ${familyData.lastModifiedBy} (${familyData.lastModifiedDate ? new Date(familyData.lastModifiedDate).toLocaleString('km-KH', { day:'2-digit', month:'2-digit', year:'numeric', hour: '2-digit', minute:'2-digit', hour12: true }) : 'N/A'})`, indent, yPosition); yPosition += lineHeight;}
        if (familyData.enteredBy){ doc.text(`បានបញ្ចូលដោយ: ${familyData.enteredBy}`, indent, yPosition); yPosition += lineHeight;}
        yPosition += lineHeight * 0.5; doc.setFontSize(13); doc.text("សមាជិកគ្រួសារ:", indent, yPosition); yPosition += lineHeight;
        if (familyData.members && familyData.members.length > 0) {
            const memberTableHeaders = ["ល.រ", "ឈ្មោះ", "ភេទ", "ថ្ងៃខែឆ្នាំកំណើត", "ខេត្តកំណើត", "កម្រិតវប្បធម៌", "មុខរបរ", "លេខអត្ត.", "លេខការិ.", "ចំណាកស្រុកក្នុង", "ចំណាកស្រុកក្រៅ"];
            const memberTableBody = familyData.members.map((member, index) => [index + 1, member.name || 'N/A', member.gender || 'N/A', member.dob ? new Date(member.dob).toLocaleDateString('km-KH', {day:'2-digit', month:'2-digit', year:'numeric'}) : 'N/A', member.birthProvince || 'N/A', member.educationLevel || 'N/A', member.occupation || 'N/A', member.nationalId || 'N/A', member.electionOfficeId || 'N/A', member.internalMigration === 'បាទ' ? 'បាទ' : 'ទេ', member.externalMigration === 'បាទ' ? 'បាទ' : 'ទេ']);
            doc.autoTable({ startY: yPosition, head: [memberTableHeaders], body: memberTableBody, theme: 'grid', headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0], font: FONT_NAME_JSPDF, fontSize: 8, halign: 'center' }, bodyStyles: { font: FONT_NAME_JSPDF, fontSize: 7.5, cellPadding: 1.5, }, columnStyles: { 0: { cellWidth: 8, halign: 'center' }, 7: { cellWidth: 15 }, 8: { cellWidth: 15 }, 9: { cellWidth: 12, halign: 'center'}, 10: {cellWidth: 12, halign: 'center'} }, margin: { left: indent, right: indent }, tableWidth: 'auto', didDrawPage: async function (data) { await loadKhmerFont(doc); }});
            yPosition = doc.lastAutoTable.finalY + lineHeight;
        } else { doc.setFontSize(10); doc.text("មិនមានសមាជិកគ្រួសារ។", indent + 5, yPosition); yPosition += lineHeight;}
        yPosition += lineHeight * 0.5;
        if (yPosition > doc.internal.pageSize.getHeight() - 40) { doc.addPage(); yPosition = 15; await loadKhmerFont(doc);}
        doc.setFontSize(13); doc.text("ទ្រព្យសម្បត្តិ និងអាជីវកម្ម:", indent, yPosition); yPosition += lineHeight; doc.setFontSize(10);
        let hasAssets = false;
        if (familyData.assets && typeof familyData.assets === 'object' && Object.keys(familyData.assets).length > 0) {
            for (const def of assetFieldDefinitions) {
                const assetValue = familyData.assets[def.id];
                if (assetValue !== undefined && assetValue !== null && String(assetValue).trim() !== "" && String(assetValue).trim() !== "0") {
                    if (yPosition > doc.internal.pageSize.getHeight() - 20) { doc.addPage(); yPosition = 15; await loadKhmerFont(doc); doc.setFontSize(10);}
                    const textToPrint = `  • ${def.label}: ${assetValue}`;
                    const textLines = doc.splitTextToSize(textToPrint, contentWidth - 8);
                    doc.text(textLines, indent + 2, yPosition); yPosition += (lineHeight - 2) * textLines.length; hasAssets = true;
                }
            }
        }
        if (!hasAssets) { if (yPosition > doc.internal.pageSize.getHeight() - 20) { doc.addPage(); yPosition = 15; await loadKhmerFont(doc); doc.setFontSize(10);} doc.text("  មិនមានទ្រព្យសម្បត្តិ/អាជីវកម្ម។", indent + 2, yPosition); yPosition += lineHeight;}
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i); await loadKhmerFont(doc); doc.setFontSize(9); doc.setTextColor(100);
            doc.text(`ទំព័រ ${i} នៃ ${pageCount}`, pageWidth - indent, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
            doc.text(`បោះពុម្ពថ្ងៃទី: ${new Date().toLocaleDateString('km-KH', {day:'2-digit', month:'long', year:'numeric'})} (Admin: ${adminUsernameFromSession})`, indent, doc.internal.pageSize.getHeight() - 10);
        }
        doc.save(`Admin-ទិន្នន័យគ្រួសារ-${familyData.familyName || familyData.familyId}.pdf`);
        alert("ការបង្កើត PDF បានបញ្ចប់។ សូមពិនិត្យមើលឯកសារដែលបានទាញយក។");
    };

    const renderFamilyCardForAdmin = (familyData, containerElement, villageContextName) => {
         if (!familyCardTemplate || !familyCardTemplate.content) {console.error("Admin: Family card template or content missing"); return;}
         const cardClone = familyCardTemplate.content.cloneNode(true); const familyCard = cardClone.querySelector('.family-card');
         if (!familyCard) {console.error("Admin: '.family-card' missing in template"); return;}
         familyCard.dataset.familyId = familyData.familyId; familyCard.dataset.village = villageContextName;
         familyCard.querySelector('.family-card-name').textContent = `${familyData.familyName || 'N/A'} (ភូមិ ${villageContextName})`;
         try { familyCard.querySelector('.family-card-entry-date').textContent = `កាលបរិច្ឆេទបញ្ចូល: ${new Date(familyData.entryDate).toLocaleDateString('km-KH', { day: '2-digit', month: 'short', year: 'numeric' })}`;}
         catch { familyCard.querySelector('.family-card-entry-date').textContent = `កាលបរិច្ឆេទបញ្ចូល: មិនត្រឹមត្រូវ`; }
         const membersTableBody = familyCard.querySelector('.members-table tbody'); let familyMemberCount = 0;
         if (familyData.members && Array.isArray(familyData.members)) {
             familyMemberCount = familyData.members.length; membersTableBody.innerHTML = '';
             if (familyMemberCount > 0) {
                familyData.members.forEach(member => {
                    const row = membersTableBody.insertRow();
                    row.insertCell().textContent = member.name || 'N/A'; row.insertCell().textContent = member.gender || 'N/A';
                    row.insertCell().textContent = member.dob ? new Date(member.dob).toLocaleDateString('km-KH', {day:'2-digit',month:'2-digit',year:'numeric'}) : 'N/A';
                    row.insertCell().textContent = member.birthProvince || 'N/A'; row.insertCell().textContent = member.educationLevel || 'N/A';
                    row.insertCell().textContent = member.occupation || 'N/A'; row.insertCell().textContent = member.nationalId || 'N/A';
                    row.insertCell().textContent = member.electionOfficeId || 'N/A'; row.insertCell().textContent = member.internalMigration || 'N/A';
                    row.insertCell().textContent = member.externalMigration || 'N/A';
                });
             } else { membersTableBody.innerHTML = '<tr><td colspan="10" style="text-align:center;">មិនមានសមាជិកគ្រួសារ។</td></tr>';}
         } else if (membersTableBody) { membersTableBody.innerHTML = '<tr><td colspan="10" style="text-align:center;">មិនមានព័ត៌មានសមាជិក។</td></tr>';}
         const memberCountEl = familyCard.querySelector('.family-member-count'); if(memberCountEl) memberCountEl.textContent = familyMemberCount;
         const assetsDiv = familyCard.querySelector('.assets-details');
         if (assetsDiv) {
             assetsDiv.innerHTML = ''; let hasAssets = false;
             if (familyData.assets && typeof familyData.assets === 'object') {
                 assetFieldDefinitions.forEach(def => {
                    const assetValue = familyData.assets[def.id];
                    if (assetValue !== undefined && assetValue !== null && String(assetValue).trim() !== "" && String(assetValue).trim() !== "0") {
                         const p = document.createElement('p'); p.innerHTML = `<strong>${def.label}:</strong> ${assetValue}`; assetsDiv.appendChild(p); hasAssets = true;
                     }
                 });
             }
             if (!hasAssets) assetsDiv.innerHTML = '<p><em>មិនមានទ្រព្យសម្បត្តិ/អាជីវកម្ម។</em></p>';
         }
         const actionsDiv = familyCard.querySelector('.family-card-actions');
         if (actionsDiv) {
             actionsDiv.style.display = 'block';
             const editBtn = actionsDiv.querySelector('.edit-family-button');
             const deleteBtn = actionsDiv.querySelector('.delete-family-button');
             const printBtn = actionsDiv.querySelector('.print-family-button');
             if (editBtn) editBtn.onclick = () => openEditFamilyModalForAdmin(villageContextName, familyData.familyId, familyData);
             if (deleteBtn) deleteBtn.onclick = () => deleteFamilyDataForAdmin(villageContextName, familyData.familyId, familyData.familyName);
             if (printBtn) printBtn.onclick = () => printSingleFamilyDataToPDF(familyData, villageContextName);
         }
         containerElement.appendChild(cardClone);
    };

    const loadFamilyDataForSelectedVillageAdmin = (villageName, searchTerm = '') => {
         if (!familyListContainerAdmin || !selectedVillageNameH3 || !noFamilyDataMessageAdmin) { console.warn("Admin: Family display/message elements are missing."); return;}
         familyListContainerAdmin.innerHTML = ''; noFamilyDataMessageAdmin.style.display = 'none';
         if (!villageName && !searchTerm) {
            selectedVillageNameH3.textContent = 'ទិន្នន័យគ្រួសារ: [មិនបានជ្រើសរើសភូមិ]';
            noFamilyDataMessageAdmin.textContent = 'សូមជ្រើសរើសភូមិដើម្បីបង្ហាញទិន្នន័យ ឬធ្វើការស្វែងរក។';
            noFamilyDataMessageAdmin.style.display = 'block'; return;
         }
         const allVillageData = getVillageDataStorage(); let familiesToDisplay = [];
         if (villageName && !searchTerm) {
            selectedVillageNameH3.textContent = `ទិន្នន័យគ្រួសារសម្រាប់ភូមិ: ${villageName}`;
            familiesToDisplay = (allVillageData[villageName] && Array.isArray(allVillageData[villageName])) ? [...allVillageData[villageName]] : [];
         } else if (villageName && searchTerm) {
            selectedVillageNameH3.textContent = `លទ្ធផលស្វែងរកក្នុងភូមិ ${villageName} សម្រាប់: "${searchTerm}"`;
            const familiesInSelectedVillage = (allVillageData[villageName] && Array.isArray(allVillageData[villageName])) ? allVillageData[villageName] : [];
            const searchTermLower = searchTerm.toLowerCase();
            familiesToDisplay = familiesInSelectedVillage.filter(family => (family.familyName && family.familyName.toLowerCase().includes(searchTermLower)) || (family.members && family.members.some(mem => (mem.name && mem.name.toLowerCase().includes(searchTermLower)) || (mem.nationalId && mem.nationalId.includes(searchTermLower)))));
         } else if (!villageName && searchTerm) {
            selectedVillageNameH3.textContent = `លទ្ធផលស្វែងរកសកលសម្រាប់: "${searchTerm}"`; const searchTermLower = searchTerm.toLowerCase();
            for (const vName in allVillageData) {
                if (allVillageData.hasOwnProperty(vName) && Array.isArray(allVillageData[vName])) {
                    allVillageData[vName].forEach(family => {
                        if ((family.familyName && family.familyName.toLowerCase().includes(searchTermLower)) || (family.members && family.members.some(mem => (mem.name && mem.name.toLowerCase().includes(searchTermLower)) || (mem.nationalId && mem.nationalId.includes(searchTermLower))))) {
                            familiesToDisplay.push({ ...family, _villageContextForDisplay: vName });
                        }
                    });
                }
            }
         }
         if (familiesToDisplay.length > 0) {
             familiesToDisplay.sort((a, b) => new Date(b.entryDate) - new Date(a.entryDate));
             familiesToDisplay.forEach(family => renderFamilyCardForAdmin(family, familyListContainerAdmin, family._villageContextForDisplay || villageName));
         } else {
             noFamilyDataMessageAdmin.textContent = searchTerm ? `រកមិនឃើញលទ្ធផលសម្រាប់ "${searchFamilyInput ? searchFamilyInput.value : searchTerm}"${villageName ? ` នៅក្នុងភូមិ ${villageName}` : ' ទូទាំងប្រព័ន្ធ'}។` : (villageName ? `មិនមានទិន្នន័យគ្រួសារសម្រាប់ភូមិ ${villageName} ទេ។` : 'សូមធ្វើការស្វែងរក។');
             noFamilyDataMessageAdmin.style.display = 'block';
         }
    };

    const displayGlobalAssetSummary = (allVillageData) => {
        if (!adminAssetSummaryTbody) return;
        const assetTotals = {}; assetFieldDefinitions.forEach(def => { if (def.type === 'number' || def.isLandArea) assetTotals[def.id] = 0; });
        for (const villageNameKey in allVillageData) {
            if (allVillageData.hasOwnProperty(villageNameKey) && Array.isArray(allVillageData[villageNameKey])) {
                allVillageData[villageNameKey].forEach(family => {
                    if (family.assets && typeof family.assets === 'object') {
                        assetFieldDefinitions.forEach(def => {
                            const assetKey = def.id; const assetValue = family.assets[assetKey];
                            if (assetValue !== undefined && assetTotals.hasOwnProperty(assetKey)) {
                                if (def.isLandArea) { const parsed = parseLandSize(String(assetValue)); if (parsed) assetTotals[assetKey] += convertToHectares(parsed.value, parsed.unit);}
                                else if (def.type === 'number') { const value = parseInt(assetValue, 10); if (!isNaN(value)) assetTotals[assetKey] += value;}
                            }
                        });
                    }
                });
            }
        }
        adminAssetSummaryTbody.innerHTML = ''; let hasAnyGlobalAssets = false;
        assetFieldDefinitions.forEach(def => {
            const row = adminAssetSummaryTbody.insertRow(); row.insertCell().textContent = def.label;
            const totalCell = row.insertCell();
            if (assetTotals.hasOwnProperty(def.id)) {
                const totalValue = assetTotals[def.id];
                if (totalValue > 0 || (def.isLandArea && totalValue !== undefined && totalValue !== null && totalValue !== 0 )) hasAnyGlobalAssets = true;
                if (def.isLandArea) { const formattedHectares = parseFloat(totalValue.toFixed(4)); totalCell.textContent = `${formattedHectares} ហិចតា`;}
                else { totalCell.textContent = totalValue; }
            } else { totalCell.textContent = def.isLandArea ? '0 ហិចតា' : (def.type === 'number' ? '0' : '-'); }
        });
         if (!hasAnyGlobalAssets && Object.keys(allVillageData).length > 0 && Object.values(allVillageData).some(vf => vf.length > 0)) { adminAssetSummaryTbody.innerHTML = '<tr><td colspan="2"><em>មិនមានទិន្នន័យទ្រព្យសម្បត្តិសរុប។</em></td></tr>';}
         else if (Object.keys(allVillageData).length === 0 || !Object.values(allVillageData).some(vf => vf.length > 0)) { adminAssetSummaryTbody.innerHTML = '<tr><td colspan="2"><em>មិនមានទិន្នន័យដើម្បីគណនា។</em></td></tr>';}
    };

    const calculateAdminSummary = () => {
        if (!totalVillagesAdminSpan || /* ... other span checks ... */ !eduLevelOtherFemaleAdminSpan ) { console.warn("Admin Dashboard: One or more summary span elements are missing."); return; }
        const allVillageData = getVillageDataStorage();
        let totalFamiliesAll = 0, totalPeopleAll = 0, totalFemalesAll = 0, totalInternalMigrantsAll = 0, totalExternalMigrantsAll = 0, femaleInternalMigrantsAll = 0, femaleExternalMigrantsAll = 0;
        let villageCount = Object.keys(getRegisteredVillages()).length;
        let count0_2_All = 0, count0_2_Female_All = 0, count3_4_All = 0, count3_4_Female_All = 0, count5_5_All = 0, count5_5_Female_All = 0, count6_6_All = 0, count6_6_Female_All = 0, count7_11_All = 0, count7_11_Female_All = 0, count12_14_All = 0, count12_14_Female_All = 0, count15_17_All = 0, count15_17_Female_All = 0, count18_24_All = 0, count18_24_Female_All = 0, count25_35_All = 0, count25_35_Female_All = 0, count36_45_All = 0, count36_45_Female_All = 0, count46_60_All = 0, count46_60_Female_All = 0, count61_Plus_All = 0, count61_Plus_Female_All = 0;
        const educationStatsAdmin = {}; Object.keys(trackedEducationLevels).forEach(eduKey => { educationStatsAdmin[eduKey] = { total: 0, female: 0 }; });
        for (const villageNameKey in allVillageData) {
            if (allVillageData.hasOwnProperty(villageNameKey) && Array.isArray(allVillageData[villageNameKey])) {
                const familiesInThisVillage = allVillageData[villageNameKey]; totalFamiliesAll += familiesInThisVillage.length;
                familiesInThisVillage.forEach(family => {
                    if (family.members && Array.isArray(family.members)) {
                        totalPeopleAll += family.members.length;
                        family.members.forEach(member => {
                            if (member.gender === 'ស្រី') { totalFemalesAll++; }
                            if (member.internalMigration === 'បាទ') { totalInternalMigrantsAll++; if (member.gender === 'ស្រី') femaleInternalMigrantsAll++;}
                            if (member.externalMigration === 'បាទ') { totalExternalMigrantsAll++; if (member.gender === 'ស្រី') femaleExternalMigrantsAll++;}
                            const age = calculateAge(member.dob);
                            if (age !== null) {
                                if (age <= 2) { count0_2_All++; if (member.gender === 'ស្រី') count0_2_Female_All++; }
                                else if (age <= 4) { count3_4_All++; if (member.gender === 'ស្រី') count3_4_Female_All++; }
                                else if (age === 5) { count5_5_All++; if (member.gender === 'ស្រី') count5_5_Female_All++; }
                                else if (age === 6) { count6_6_All++; if (member.gender === 'ស្រី') count6_6_Female_All++; }
                                else if (age <= 11) { count7_11_All++; if (member.gender === 'ស្រី') count7_11_Female_All++; }
                                else if (age <= 14) { count12_14_All++; if (member.gender === 'ស្រី') count12_14_Female_All++; }
                                else if (age <= 17) { count15_17_All++; if (member.gender === 'ស្រី') count15_17_Female_All++; }
                                else if (age <= 24) { count18_24_All++; if (member.gender === 'ស្រី') count18_24_Female_All++; }
                                else if (age <= 35) { count25_35_All++; if (member.gender === 'ស្រី') count25_35_Female_All++; }
                                else if (age <= 45) { count36_45_All++; if (member.gender === 'ស្រី') count36_45_Female_All++; }
                                else if (age <= 60) { count46_60_All++; if (member.gender === 'ស្រី') count46_60_Female_All++; }
                                else { count61_Plus_All++; if (member.gender === 'ស្រី') count61_Plus_Female_All++; }
                            }
                            const categorizedEdu = categorizeEducation(member.educationLevel || "");
                            if (educationStatsAdmin[categorizedEdu]) { educationStatsAdmin[categorizedEdu].total++; if (member.gender === 'ស្រី') educationStatsAdmin[categorizedEdu].female++;}
                            else { educationStatsAdmin["ផ្សេងៗ"].total++; if (member.gender === 'ស្រី') educationStatsAdmin["ផ្សេងៗ"].female++;}
                        });
                    }
                });
            }
        }
        totalVillagesAdminSpan.textContent = villageCount; totalFamiliesAdminSpan.textContent = totalFamiliesAll; totalPeopleAdminSpan.textContent = totalPeopleAll; totalFemalesAdminSpan.textContent = totalFemalesAll;
        totalInternalMigrantsAdminSpan.textContent = totalInternalMigrantsAll; if(totalInternalMigrantsFemaleAdminSpan) totalInternalMigrantsFemaleAdminSpan.textContent = femaleInternalMigrantsAll;
        totalExternalMigrantsAdminSpan.textContent = totalExternalMigrantsAll; if(totalExternalMigrantsFemaleAdminSpan) totalExternalMigrantsFemaleAdminSpan.textContent = femaleExternalMigrantsAll;
        ageGroup0_2_AdminSpan.textContent = count0_2_All; ageGroup0_2_Female_AdminSpan.textContent = count0_2_Female_All; ageGroup3_4_AdminSpan.textContent = count3_4_All; ageGroup3_4_Female_AdminSpan.textContent = count3_4_Female_All;
        ageGroup5_5_AdminSpan.textContent = count5_5_All; ageGroup5_5_Female_AdminSpan.textContent = count5_5_Female_All; ageGroup6_6_AdminSpan.textContent = count6_6_All; ageGroup6_6_Female_AdminSpan.textContent = count6_6_Female_All;
        ageGroup7_11_AdminSpan.textContent = count7_11_All; ageGroup7_11_Female_AdminSpan.textContent = count7_11_Female_All; ageGroup12_14_AdminSpan.textContent = count12_14_All; ageGroup12_14_Female_AdminSpan.textContent = count12_14_Female_All;
        ageGroup15_17_AdminSpan.textContent = count15_17_All; ageGroup15_17_Female_AdminSpan.textContent = count15_17_Female_All; ageGroup18_24_AdminSpan.textContent = count18_24_All; ageGroup18_24_Female_AdminSpan.textContent = count18_24_Female_All;
        ageGroup25_35_AdminSpan.textContent = count25_35_All; ageGroup25_35_Female_AdminSpan.textContent = count25_35_Female_All; ageGroup36_45_AdminSpan.textContent = count36_45_All; ageGroup36_45_Female_AdminSpan.textContent = count36_45_Female_All;
        ageGroup46_60_AdminSpan.textContent = count46_60_All; ageGroup46_60_Female_AdminSpan.textContent = count46_60_Female_All; ageGroup61_Plus_AdminSpan.textContent = count61_Plus_All; ageGroup61_Plus_Female_AdminSpan.textContent = count61_Plus_Female_All;
        Object.keys(educationStatsAdmin).forEach(key => {
            const spanIdTotal = `edu-level-${key.toLowerCase().replace(/[^a-z0-9]/gi, '-').replace(/[^a-z0-9-]/gi, '')}-admin`;
            const spanIdFemale = `edu-level-${key.toLowerCase().replace(/[^a-z0-9]/gi, '-').replace(/[^a-z0-9-]/gi, '')}-female-admin`;
            // A more robust way to map keys to span IDs might be needed if keys don't directly map
            // For example, "លើសបរិញ្ញាបត្រ" maps to "postgraduate" spans
            if (key === "មិនបានសិក្សា") { if(eduLevelUneducatedAdminSpan) eduLevelUneducatedAdminSpan.textContent = educationStatsAdmin[key].total; if(eduLevelUneducatedFemaleAdminSpan) eduLevelUneducatedFemaleAdminSpan.textContent = educationStatsAdmin[key].female;}
            else if (key === "បឋមសិក្សា") { if(eduLevelPrimaryAdminSpan) eduLevelPrimaryAdminSpan.textContent = educationStatsAdmin[key].total; if(eduLevelPrimaryFemaleAdminSpan) eduLevelPrimaryFemaleAdminSpan.textContent = educationStatsAdmin[key].female; }
            else if (key === "អនុវិទ្យាល័យ") { if(eduLevelLowerSecondaryAdminSpan) eduLevelLowerSecondaryAdminSpan.textContent = educationStatsAdmin[key].total; if(eduLevelLowerSecondaryFemaleAdminSpan) eduLevelLowerSecondaryFemaleAdminSpan.textContent = educationStatsAdmin[key].female; }
            else if (key === "វិទ្យាល័យ") { if(eduLevelHighSchoolAdminSpan) eduLevelHighSchoolAdminSpan.textContent = educationStatsAdmin[key].total; if(eduLevelHighSchoolFemaleAdminSpan) eduLevelHighSchoolFemaleAdminSpan.textContent = educationStatsAdmin[key].female; }
            else if (key === "បរិញ្ញាបត្រ") { if(eduLevelBachelorAdminSpan) eduLevelBachelorAdminSpan.textContent = educationStatsAdmin[key].total; if(eduLevelBachelorFemaleAdminSpan) eduLevelBachelorFemaleAdminSpan.textContent = educationStatsAdmin[key].female; }
            else if (key === "ជំនាញ") { if(eduLevelSkillAdminSpan) eduLevelSkillAdminSpan.textContent = educationStatsAdmin[key].total; if(eduLevelSkillFemaleAdminSpan) eduLevelSkillFemaleAdminSpan.textContent = educationStatsAdmin[key].female; }
            else if (key === "លើសបរិញ្ញាបត្រ") { if(eduLevelPostgraduateAdminSpan) eduLevelPostgraduateAdminSpan.textContent = educationStatsAdmin[key].total; if(eduLevelPostgraduateFemaleAdminSpan) eduLevelPostgraduateFemaleAdminSpan.textContent = educationStatsAdmin[key].female; }
            else if (key === "ផ្សេងៗ") { if(eduLevelOtherAdminSpan) eduLevelOtherAdminSpan.textContent = educationStatsAdmin[key].total; if(eduLevelOtherFemaleAdminSpan) eduLevelOtherFemaleAdminSpan.textContent = educationStatsAdmin[key].female; }
        });
        displayGlobalAssetSummary(allVillageData);
    };

    const openEditFamilyModalForAdmin = (villageNameCtx, familyId, familyData) => {
        if (!familyData || typeof familyData !== 'object') { alert("ទិន្នន័យគ្រួសារមិនត្រឹមត្រូវដើម្បីកែសម្រួល។"); return; }
        if (!editFamilyModal || /* ... other element checks ... */ !editMemberTemplateAdmin || !editMemberTemplateAdmin.content) { alert("មានបញ្ហាក្នុងការបើកទម្រង់កែសម្រួល (Elements/Template ខ្វះ)។"); return; }
        editFamilyIdInput.value = familyData.familyId || familyId; editFamilyVillageInput.value = villageNameCtx || "";
        editFamilyHeadNameInput.value = familyData.familyName || ""; editFamilyHeadPhoneAdminInput.value = familyData.headOfHouseholdPhone || "";
        editFamilyMembersContainer.innerHTML = '';
        if (familyData.members && Array.isArray(familyData.members) && familyData.members.length > 0) {
            familyData.members.forEach((member, index) => {
                if (typeof member !== 'object' || member === null) { return; }
                try {
                    const memberClone = editMemberTemplateAdmin.content.cloneNode(true);
                    const memberEntryDiv = memberClone.querySelector('.member-entry'); if (!memberEntryDiv) { return; }
                    memberEntryDiv.dataset.originalMemberId = member.id || `new_admin_edit_idx_${index}_${Date.now()}`;
                    const originalIdHiddenInput = memberEntryDiv.querySelector('.member-original-id-edit'); if (originalIdHiddenInput) originalIdHiddenInput.value = memberEntryDiv.dataset.originalMemberId;
                    const titleH4 = memberEntryDiv.querySelector('h4');
                    if (titleH4) {
                        const memberNameDisplay = member.name ? ` (${member.name.substring(0,15)}${member.name.length > 15 ? '...' : ''})` : '';
                        titleH4.innerHTML = `សមាជិក${memberNameDisplay} <button type="button" class="remove-member-edit-button" title="ដកសមាជិកនេះចេញ">×</button>`;
                        const removeBtn = titleH4.querySelector('.remove-member-edit-button'); if (removeBtn) removeBtn.onclick = (e) => { e.preventDefault(); memberEntryDiv.remove(); };
                    }
                    memberFieldDefinitionsForEdit.forEach(def => {
                        const inputEl = memberEntryDiv.querySelector(`.${def.classSuffix}`);
                        if (inputEl) {
                            const valueFromData = member[def.prop];
                            if (valueFromData !== undefined && valueFromData !== null) {
                                if (def.type === 'date' && valueFromData) { try { const dateObj = new Date(valueFromData); inputEl.value = !isNaN(dateObj.valueOf()) ? dateObj.toISOString().split('T')[0] : valueFromData;} catch (e) { inputEl.value = valueFromData; }}
                                else { inputEl.value = valueFromData; }
                            } else { inputEl.value = (inputEl.tagName === 'SELECT' && def.options && def.options.length > 0) ? def.options[0].value : '';}
                        }
                    });
                    editFamilyMembersContainer.appendChild(memberClone);
                } catch (templateError) { console.error("[Admin Edit Modal] Error processing member template for member " + (index + 1) + ":", templateError); }
            });
        }
        editFamilyAssetsContainer.innerHTML = '';
        if (familyData.assets && typeof familyData.assets === 'object') {
            assetFieldDefinitions.forEach(fieldDef => {
                const assetDiv = document.createElement('div'); const assetLabel = document.createElement('label');
                assetLabel.htmlFor = `edit-modal-asset-${fieldDef.id}`; assetLabel.textContent = `${fieldDef.label}:`;
                const inputField = document.createElement('input'); inputField.type = fieldDef.type; inputField.id = `edit-modal-asset-${fieldDef.id}`; inputField.name = fieldDef.id;
                const assetValue = familyData.assets[fieldDef.id];
                inputField.value = (assetValue !== undefined && assetValue !== null) ? String(assetValue) : (fieldDef.type === 'number' ? '0' : (fieldDef.isLandArea ? "" : ""));
                if (fieldDef.type === 'number') inputField.min = "0";
                if (fieldDef.isLandArea && inputField.type === 'text' && (inputField.value === "0" || inputField.value === "")) { inputField.placeholder = "0"; if (inputField.value === "0") inputField.value = "";}
                assetDiv.appendChild(assetLabel); assetDiv.appendChild(inputField); editFamilyAssetsContainer.appendChild(assetDiv);
            });
        }
        if(editFamilyErrorAdmin) editFamilyErrorAdmin.textContent = ''; if(editFamilySuccessAdmin) editFamilySuccessAdmin.textContent = '';
        editFamilyModal.style.display = 'block';
    };

    if (editFamilyForm) {
        editFamilyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if(editFamilyErrorAdmin) editFamilyErrorAdmin.textContent = ''; if(editFamilySuccessAdmin) editFamilySuccessAdmin.textContent = '';
            const familyIdToUpdate = editFamilyIdInput.value; const villageOfFamily = editFamilyVillageInput.value;
            const updatedHeadName = editFamilyHeadNameInput.value.trim(); const updatedPhone = editFamilyHeadPhoneAdminInput ? editFamilyHeadPhoneAdminInput.value.trim() : "";
            if (!updatedHeadName) { if(editFamilyErrorAdmin) editFamilyErrorAdmin.textContent = "ឈ្មោះមេគ្រួសារមិនអាចនៅទទេបានទេ។"; return;}
            if (!villageOfFamily) { if(editFamilyErrorAdmin) editFamilyErrorAdmin.textContent = "មិនអាចកំណត់ភូមិសម្រាប់កែប្រែបានទេ។"; return;}
            const allVillageData = getVillageDataStorage();
            const originalFamilyDataForLog = JSON.parse(JSON.stringify( (allVillageData[villageOfFamily] || []).find(f => f.familyId === familyIdToUpdate) || null));
            const updatedFamilyPayload = {
                familyId: familyIdToUpdate, familyName: updatedHeadName, headOfHouseholdPhone: updatedPhone, members: [], assets: {},
                lastModifiedByAdmin: adminUsernameFromSession, lastModifiedDate: new Date().toISOString(),
                entryDate: originalFamilyDataForLog ? originalFamilyDataForLog.entryDate : new Date().toISOString(),
                enteredBy: originalFamilyDataForLog ? originalFamilyDataForLog.enteredBy : `Admin: ${adminUsernameFromSession}`
            };
            const memberEntriesFromForm = editFamilyMembersContainer.querySelectorAll('.member-entry'); let editFormValidationError = false;
            for (const memberDiv of memberEntriesFromForm) {
                const nameInput = memberDiv.querySelector('.member-name-edit'); const name = nameInput ? nameInput.value.trim() : '';
                const nationalIdInput = memberDiv.querySelector('.member-nationalId-edit'); const electionOfficeIdInput = memberDiv.querySelector('.member-electionOfficeId-edit');
                if (name) {
                    const nationalIdValue = nationalIdInput ? nationalIdInput.value.trim() : '';
                    if (nationalIdValue !== "" && nationalIdValue.length !== 9) { if(editFamilyErrorAdmin) editFamilyErrorAdmin.textContent = `សមាជិក "${name}"៖ លេខអត្តសញ្ញាណប័ណ្ណត្រូវតែមាន 9 ខ្ទង់។`; nationalIdInput.focus(); editFormValidationError = true; break;}
                    const electionOfficeIdValue = electionOfficeIdInput ? electionOfficeIdInput.value.trim() : '';
                    if (electionOfficeIdValue !== "" && electionOfficeIdValue.length !== 4) { if(editFamilyErrorAdmin) editFamilyErrorAdmin.textContent = `សមាជិក "${name}"៖ លេខការិយាល័យបោះឆ្នោតត្រូវតែមាន 4 ខ្ទង់។`; electionOfficeIdInput.focus(); editFormValidationError = true; break;}
                    const memberDataObject = {}; let originalId = memberDiv.dataset.originalMemberId;
                    const hiddenIdInput = memberDiv.querySelector('.member-original-id-edit'); if (hiddenIdInput && hiddenIdInput.value) originalId = hiddenIdInput.value;
                    memberDataObject.id = originalId;
                    if (memberDataObject.id && (memberDataObject.id.startsWith('new_admin_edit_idx_') || memberDataObject.id.startsWith('new_admin_form_') || memberDataObject.id.startsWith('new_edit_form_'))) { memberDataObject.id = `mem_${Date.now()}_${Math.random().toString(36).substr(2,5)}`;}
                    memberFieldDefinitionsForEdit.forEach(def => { const inputElem = memberDiv.querySelector(`.${def.classSuffix}`); if (inputElem) memberDataObject[def.prop] = inputElem.value.trim();});
                    updatedFamilyPayload.members.push(memberDataObject);
                }
            }
            if(editFormValidationError) return;
            editFamilyAssetsContainer.querySelectorAll('input[name]').forEach(assetInput => {
                const assetKey = assetInput.name; const assetDef = assetFieldDefinitions.find(def => def.id === assetKey);
                updatedFamilyPayload.assets[assetKey] = assetInput.type === 'number' ? (parseInt(assetInput.value, 10) || 0) : (assetInput.value.trim() || (assetDef?.isLandArea ? "0" : ""));
            });
            const allDataToSave = getVillageDataStorage();
            if (allDataToSave.hasOwnProperty(villageOfFamily) && Array.isArray(allDataToSave[villageOfFamily])) {
                const familyIndex = allDataToSave[villageOfFamily].findIndex(f => f.familyId === familyIdToUpdate);
                if (familyIndex > -1) {
                    updatedFamilyPayload.entryDate = allDataToSave[villageOfFamily][familyIndex].entryDate;
                    if(!updatedFamilyPayload.enteredBy && allDataToSave[villageOfFamily][familyIndex].enteredBy) { updatedFamilyPayload.enteredBy = allDataToSave[villageOfFamily][familyIndex].enteredBy; }
                    allDataToSave[villageOfFamily][familyIndex] = updatedFamilyPayload; saveVillageDataStorage(allDataToSave);
                    if(editFamilySuccessAdmin) editFamilySuccessAdmin.textContent = 'ទិន្នន័យគ្រួសារបានកែសម្រួលជោគជ័យ!';
                    const currentSelectedVillage = villageSelect ? villageSelect.value : null;
                    const currentSearchTerm = searchFamilyInput ? searchFamilyInput.value : '';
                    loadFamilyDataForSelectedVillageAdmin(currentSelectedVillage, currentSearchTerm); calculateAdminSummary(); loadAndDisplayActivityLog();
                    setTimeout(() => { if(editFamilyModal) editFamilyModal.style.display = 'none'; if(editFamilySuccessAdmin) editFamilySuccessAdmin.textContent = '';}, 2000);
                } else { if(editFamilyErrorAdmin) editFamilyErrorAdmin.textContent = `រកមិនឃើញទិន្នន័យគ្រួសារ ID ${familyIdToUpdate} ក្នុងភូមិ ${villageOfFamily}។`;}
            } else { if(editFamilyErrorAdmin) editFamilyErrorAdmin.textContent = `មិនមានទិន្នន័យសម្រាប់ភូមិ ${villageOfFamily}។`;}
        });
    }

    if (addMemberToEditFormButton) {
        addMemberToEditFormButton.onclick = () => {
            if (editFamilyMembersContainer.children.length < MAX_MEMBERS_EDIT) {
                if (!editMemberTemplateAdmin || !editMemberTemplateAdmin.content) { console.error("[Admin Edit] editMemberTemplateAdmin or its content is not available."); return;}
                const memberClone = editMemberTemplateAdmin.content.cloneNode(true); const memberEntryDiv = memberClone.querySelector('.member-entry');
                if (!memberEntryDiv) { console.warn("[Admin Edit] '.member-entry' div not found in template for new member."); return;}
                const newMemberOriginalId = `new_admin_form_${Date.now()}`; memberEntryDiv.dataset.originalMemberId = newMemberOriginalId;
                const originalIdHiddenInput = memberEntryDiv.querySelector('.member-original-id-edit'); if(originalIdHiddenInput) originalIdHiddenInput.value = newMemberOriginalId;
                else console.warn("[Admin Edit] '.member-original-id-edit' not found in new member template.");
                const titleH4 = memberEntryDiv.querySelector('h4');
                if (titleH4) {
                    titleH4.innerHTML = `សមាជិកថ្មី <button type="button" class="remove-member-edit-button" title="ដកសមាជិកនេះចេញ">×</button>`;
                    const removeBtn = titleH4.querySelector('.remove-member-edit-button'); if (removeBtn) removeBtn.onclick = (e) => { e.preventDefault(); memberEntryDiv.remove(); };
                }
                memberEntryDiv.querySelectorAll('input[type="text"], input[type="date"], input[type="tel"], input[type="number"]').forEach(input => input.value = '');
                memberEntryDiv.querySelectorAll('select').forEach(select => select.selectedIndex = 0);
                editFamilyMembersContainer.appendChild(memberClone);
            } else { alert(`មិនអាចបន្ថែមសមាជិកលើសពី ${MAX_MEMBERS_EDIT} នាក់បានទេ។`);}
        };
    }

    if (closeEditFamilyModalButton && editFamilyModal) { closeEditFamilyModalButton.onclick = () => { editFamilyModal.style.display = 'none'; };}
    window.onclick = (event) => {
        if (event.target === editFamilyModal && editFamilyModal) { editFamilyModal.style.display = 'none';}
        if (event.target === messageModalAdmin && messageModalAdmin) { messageModalAdmin.style.display = 'none'; updateAdminUnreadCount(); }
    };

    const deleteFamilyDataForAdmin = (villageOfFamily, familyIdToDelete, familyNameToConfirm = '') => {
        const confirmMsg = familyNameToConfirm ? `តើអ្នកពិតជាចង់លុបទិន្នន័យគ្រួសារ "${familyNameToConfirm}" (ID: ${familyIdToDelete}) ពីភូមិ "${villageOfFamily}" មែនទេ? ការលុបនេះមិនអាចយកមកវិញបានទេ!` : `តើអ្នកពិតជាចង់លុបទិន្នន័យគ្រួសារ ID: ${familyIdToDelete} ពីភូមិ "${villageOfFamily}" មែនទេ? ការលុបនេះមិនអាចយកមកវិញបានទេ!`;
        if (!confirm(confirmMsg)) return;
        const allVillageData = getVillageDataStorage();
        if (allVillageData.hasOwnProperty(villageOfFamily) && Array.isArray(allVillageData[villageOfFamily])) {
            const initialLength = allVillageData[villageOfFamily].length;
            allVillageData[villageOfFamily] = allVillageData[villageOfFamily].filter(family => family.familyId !== familyIdToDelete);
            if (allVillageData[villageOfFamily].length < initialLength) {
                saveVillageDataStorage(allVillageData);
                loadFamilyDataForSelectedVillageAdmin(villageSelect.value, searchFamilyInput ? searchFamilyInput.value : '');
                calculateAdminSummary(); loadAndDisplayActivityLog();
                alert(`ទិន្នន័យគ្រួសារ "${familyNameToConfirm || familyIdToDelete}" ត្រូវបានលុប។`);
            } else { alert('រកមិនឃើញទិន្នន័យគ្រួសារដែលត្រូវលុប។'); }
        } else { alert(`មិនមានទិន្នន័យសម្រាប់ភូមិ ${villageOfFamily} ដើម្បីលុប។`); }
    };

    const generateAndDisplayDailyReport = () => {
        if (!reportDateSpan || !dailyReportContentDiv) return;
        const today = new Date(); reportDateSpan.textContent = today.toLocaleDateString('km-KH', {day: '2-digit', month: 'long', year: 'numeric'});
        dailyReportContentDiv.innerHTML = ''; const allVillageData = getVillageDataStorage(); const todayStr = today.toISOString().split('T')[0];
        let reportHTML = '<ul>'; let entriesTodayCount = 0;
        for (const vName in allVillageData) {
            if (allVillageData.hasOwnProperty(vName) && Array.isArray(allVillageData[vName])) {
                const familiesEnteredTodayInVillage = allVillageData[vName].filter(f => f.entryDate && String(f.entryDate).startsWith(todayStr));
                if (familiesEnteredTodayInVillage.length > 0) { reportHTML += `<li><strong>ភូមិ ${vName}:</strong> ${familiesEnteredTodayInVillage.length} គ្រួសារ</li>`; entriesTodayCount += familiesEnteredTodayInVillage.length;}
            }
        }
        if (entriesTodayCount === 0) reportHTML += '<li><em>មិនមានការបញ្ចូលទិន្នន័យថ្មីសម្រាប់ថ្ងៃនេះទេ។</em></li>';
        reportHTML += '</ul>'; dailyReportContentDiv.innerHTML = reportHTML;
    };
    if (generateDailyReportButton) {
        generateDailyReportButton.addEventListener('click', generateAndDisplayDailyReport);
        if(reportDateSpan) reportDateSpan.textContent = new Date().toLocaleDateString('km-KH', {day: '2-digit', month: 'long', year: 'numeric'});
    }

    const performAdminFamilySearch = () => {
        if (!searchFamilyInput || !villageSelect) return;
        const searchTerm = searchFamilyInput.value.trim(); const selectedVillage = villageSelect.value;
        loadFamilyDataForSelectedVillageAdmin(selectedVillage, searchTerm);
    };
    if (searchFamilyButton) searchFamilyButton.addEventListener('click', performAdminFamilySearch);
    if (searchFamilyInput) {
        searchFamilyInput.addEventListener('keypress', e => { if (e.key === 'Enter') performAdminFamilySearch(); });
        searchFamilyInput.addEventListener('input', (e) => {
            if (e.target.value.trim() === '') { const selectedVillage = villageSelect ? villageSelect.value : null; loadFamilyDataForSelectedVillageAdmin(selectedVillage); }
        });
    }

    const loadAndDisplayActivityLog = () => {
        if (!activityLogTbody) { console.warn("Admin: Activity log tbody element not found."); return;}
        activityLogTbody.innerHTML = ''; let log = []; const storedLog = localStorage.getItem(ACTIVITY_LOG_KEY);
        if (storedLog) { try { log = JSON.parse(storedLog); if (!Array.isArray(log)) log = [];} catch (e) { console.error("Admin: Error parsing activity log:", e); log = []; }}
        if (log.length === 0) {
            const row = activityLogTbody.insertRow(); const cell = row.insertCell(); cell.colSpan = 6;
            cell.textContent = 'មិនទាន់មានសកម្មភាពកត់ត្រាទេ។'; cell.style.textAlign = 'center'; return;
        }
        log.forEach(entry => {
            const row = activityLogTbody.insertRow(); const timestamp = new Date(entry.timestamp);
            const formattedTime = `${timestamp.toLocaleDateString('km-KH', {day: '2-digit', month: '2-digit', year: 'numeric'})} ${timestamp.toLocaleTimeString('km-KH', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}`;
            row.insertCell().textContent = formattedTime; row.insertCell().textContent = entry.villageName || 'N/A';
            let actionText = entry.action || 'N/A';
            if (entry.action === 'EDITED_FAMILY') actionText = 'កែសម្រួលគ្រួសារ';
            else if (entry.action === 'DELETED_FAMILY') actionText = 'លុបគ្រួសារ';
            else if (entry.action === 'ADDED_FAMILY') actionText = 'បញ្ចូលគ្រួសារថ្មី';
            row.insertCell().textContent = actionText;
            row.insertCell().textContent = entry.familyName ? `${entry.familyName} (ID: ${entry.familyId ? entry.familyId.slice(-6) : 'N/A'})` : (entry.familyId || 'N/A');
            const detailsCell = row.insertCell(); detailsCell.innerHTML = (entry.details || 'N/A').replace(/;\s*\n?/g, '<br>');
            detailsCell.style.fontSize = '0.85em'; detailsCell.style.maxWidth = '350px'; detailsCell.style.wordBreak = 'break-word';
            row.insertCell().textContent = entry.modifiedBy || 'N/A';
        });
    };

    if (villageSelect) {
        villageSelect.addEventListener('change', (e) => {
            const selectedVillage = e.target.value; if(searchFamilyInput) searchFamilyInput.value = '';
            loadFamilyDataForSelectedVillageAdmin(selectedVillage);
        });
    }
    if (logoutButton) { logoutButton.addEventListener('click', () => { sessionStorage.clear(); window.location.href = 'index.html'; }); }

    if (typeof loadRegisteredVillagesList === 'function') loadRegisteredVillagesList();
    if (typeof calculateAdminSummary === 'function') calculateAdminSummary();
    const initialVillage = villageSelect ? villageSelect.value : null;
    const initialSearch = searchFamilyInput ? searchFamilyInput.value : '';
    if (typeof loadFamilyDataForSelectedVillageAdmin === 'function') loadFamilyDataForSelectedVillageAdmin(initialVillage, initialSearch);
    if (typeof loadAndDisplayActivityLog === 'function') loadAndDisplayActivityLog();
    if (typeof updateAdminUnreadCount === 'function') updateAdminUnreadCount();
});
