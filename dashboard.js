// dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Determine User Type and Village to Display ---
    let currentUserType = sessionStorage.getItem('loggedInUserType');
    let villageChiefVillageName = sessionStorage.getItem('loggedInVillage');
    let adminViewingVillage = sessionStorage.getItem('adminViewingVillage');
    let currentAdminUsername = sessionStorage.getItem('loggedInUsername');

    let villageToDisplay = '';
    let currentVillageIdForMessaging = '';
    let adminIdForMessaging = ''; // For messaging, this is the ID of the admin account

    let isAdminViewing = false;
    let villageChiefCanEdit = false; // Permission for village chief to edit/delete

    const VILLAGES_KEY = 'registeredVillages_v2';
    const getRegisteredVillages = () => {
        const villages = localStorage.getItem(VILLAGES_KEY);
        try {
            const parsed = JSON.parse(villages);
            return typeof parsed === 'object' && parsed !== null ? parsed : {};
        } catch (e) { console.error("Error parsing registered villages from localStorage", e); return {};}
    };

    // Get the global admin username to construct adminIdForMessaging
    const adminAccountInfo = JSON.parse(localStorage.getItem('adminAccount_v2') || '{}');
    if (adminAccountInfo && adminAccountInfo.username) {
        adminIdForMessaging = `admin:${adminAccountInfo.username}`;
    }

    if (currentUserType === 'admin' && adminViewingVillage) {
        villageToDisplay = adminViewingVillage;
        isAdminViewing = true;
        villageChiefCanEdit = true; // Admin effectively has edit rights when viewing
        currentVillageIdForMessaging = `village:${villageToDisplay}`; // Context for potential actions
    } else if (currentUserType === 'village' && villageChiefVillageName) {
        villageToDisplay = villageChiefVillageName;
        isAdminViewing = false;
        sessionStorage.removeItem('adminViewingVillage'); // Clear this if a village chief logs in
        currentVillageIdForMessaging = `village:${villageToDisplay}`;
        const allRegisteredVillages = getRegisteredVillages();
        if (allRegisteredVillages[villageToDisplay]) {
            villageChiefCanEdit = allRegisteredVillages[villageToDisplay].canEditData === true;
        } else {
            villageChiefCanEdit = false; // Should not happen if registration is correct
        }
    } else {
        console.error("Invalid access state for dashboard. Redirecting.");
        alert('ការចូលប្រើមិនត្រឹមត្រូវ ឬព័ត៌មានបាត់! កំពុងត្រឡប់ទៅទំព័រ Login។');
        sessionStorage.clear(); window.location.href = 'index.html'; return;
    }

    // --- DOM References ---
    const dashboardTitle = document.getElementById('dashboard-title');
    const welcomeMessage = document.getElementById('welcome-message');
    const currentDateTimeDisplay = document.getElementById('current-date-time');
    const logoutButton = document.getElementById('logout-button');
    const backToAdminButton = document.getElementById('back-to-admin-button');
    const adminViewNotice = document.getElementById('admin-view-notice');
    const villageEditPermissionNotice = document.getElementById('village-edit-permission-notice');
    const dataInputSection = document.getElementById('data-input-section');
    const familyDataEntryForm = document.getElementById('family-data-entry-form');
    const familyHeadNameInput = document.getElementById('family-head-name');
    const familyHeadPhoneInput = document.getElementById('family-head-phone');
    const dataEntrySuccessMsg = document.getElementById('data-entry-success');
    const dataEntryErrorMsg = document.getElementById('data-entry-error');
    const familyListContainer = document.getElementById('family-list-container');
    const noFamilyDataMessage = document.getElementById('no-family-data-message');
    const familyCardTemplate = document.getElementById('family-card-template');
    const memberFieldsContainer = document.getElementById('member-fields-container');
    const addMemberButton = document.getElementById('add-member-button');
    const currentVillageNameStats = document.getElementById('current-village-name-stats');
    const totalFamiliesVillageSpan = document.getElementById('total-families-village');
    const totalPeopleVillageSpan = document.getElementById('total-people-village');
    const totalFemalesVillageSpan = document.getElementById('total-females-village');
    const todayEntriesVillageSpan = document.getElementById('today-entries-village');
    const totalInternalMigrantsVillageSpan = document.getElementById('total-internal-migrants-village');
    const totalExternalMigrantsVillageSpan = document.getElementById('total-external-migrants-village');
    const toggleFormButton = document.getElementById('toggle-form-button');
    const currentVillageNameAssets = document.getElementById('current-village-name-assets');
    const villageAssetSummaryTbody = document.getElementById('village-asset-summary-tbody');
    const searchVillageInput = document.getElementById('search-village-input');
    const searchVillageButton = document.getElementById('search-village-button');
    const editFamilyModal = document.getElementById('edit-family-modal-admin'); // Shared modal
    const closeEditFamilyModalButton = document.getElementById('close-edit-family-modal-admin');
    const editFamilyForm = document.getElementById('edit-family-form-admin');
    const editFamilyIdInput = document.getElementById('edit-family-id-admin');
    const editFamilyVillageInput = document.getElementById('edit-family-village-admin');
    const editFamilyHeadNameInput = document.getElementById('edit-family-head-name-admin');
    const editFamilyHeadPhoneAdminInput = document.getElementById('edit-family-head-phone-admin');
    const editFamilyMembersContainer = document.getElementById('edit-family-members-container-admin');
    const addMemberToEditFormButton = document.getElementById('add-member-to-edit-form-admin');
    const editFamilyAssetsContainer = document.getElementById('edit-family-assets-container-admin');
    const editMemberTemplateAdmin = document.getElementById('edit-member-template-admin'); // Shared template
    const editFamilyErrorAdmin = document.getElementById('edit-family-error-admin');
    const editFamilySuccessAdmin = document.getElementById('edit-family-success-admin');

    // Age group spans
    const ageGroup0_2_VillageSpan = document.getElementById('age-group-0-2-village');
    const ageGroup0_2_Female_VillageSpan = document.getElementById('age-group-0-2-female-village');
    const ageGroup3_4_VillageSpan = document.getElementById('age-group-3-4-village');
    const ageGroup3_4_Female_VillageSpan = document.getElementById('age-group-3-4-female-village');
    const ageGroup5_5_VillageSpan = document.getElementById('age-group-5-5-village');
    const ageGroup5_5_Female_VillageSpan = document.getElementById('age-group-5-5-female-village');
    const ageGroup6_6_VillageSpan = document.getElementById('age-group-6-6-village');
    const ageGroup6_6_Female_VillageSpan = document.getElementById('age-group-6-6-female-village');
    const ageGroup7_11_VillageSpan = document.getElementById('age-group-7-11-village');
    const ageGroup7_11_Female_VillageSpan = document.getElementById('age-group-7-11-female-village');
    const ageGroup12_14_VillageSpan = document.getElementById('age-group-12-14-village');
    const ageGroup12_14_Female_VillageSpan = document.getElementById('age-group-12-14-female-village');
    const ageGroup15_17_VillageSpan = document.getElementById('age-group-15-17-village');
    const ageGroup15_17_Female_VillageSpan = document.getElementById('age-group-15-17-female-village');
    const ageGroup18_24_VillageSpan = document.getElementById('age-group-18-24-village');
    const ageGroup18_24_Female_VillageSpan = document.getElementById('age-group-18-24-female-village');
    const ageGroup25_35_VillageSpan = document.getElementById('age-group-25-35-village');
    const ageGroup25_35_Female_VillageSpan = document.getElementById('age-group-25-35-female-village');
    const ageGroup36_45_VillageSpan = document.getElementById('age-group-36-45-village');
    const ageGroup36_45_Female_VillageSpan = document.getElementById('age-group-36-45-female-village');
    const ageGroup46_60_VillageSpan = document.getElementById('age-group-46-60-village');
    const ageGroup46_60_Female_VillageSpan = document.getElementById('age-group-46-60-female-village');
    const ageGroup61_Plus_VillageSpan = document.getElementById('age-group-61-plus-village');
    const ageGroup61_Plus_Female_VillageSpan = document.getElementById('age-group-61-plus-female-village');
    const totalInternalMigrantsFemaleVillageSpan = document.getElementById('total-internal-migrants-female-village');
    const totalExternalMigrantsFemaleVillageSpan = document.getElementById('total-external-migrants-female-village');

    // Education level spans
    const eduLevelUneducatedVillageSpan = document.getElementById('edu-level-uneducated-village');
    const eduLevelUneducatedFemaleVillageSpan = document.getElementById('edu-level-uneducated-female-village');
    const eduLevelPrimaryVillageSpan = document.getElementById('edu-level-primary-village');
    const eduLevelPrimaryFemaleVillageSpan = document.getElementById('edu-level-primary-female-village');
    const eduLevelLowerSecondaryVillageSpan = document.getElementById('edu-level-lower-secondary-village');
    const eduLevelLowerSecondaryFemaleVillageSpan = document.getElementById('edu-level-lower-secondary-female-village');
    const eduLevelHighSchoolVillageSpan = document.getElementById('edu-level-high-school-village');
    const eduLevelHighSchoolFemaleVillageSpan = document.getElementById('edu-level-high-school-female-village');
    const eduLevelBachelorVillageSpan = document.getElementById('edu-level-bachelor-village');
    const eduLevelBachelorFemaleVillageSpan = document.getElementById('edu-level-bachelor-female-village');
    const eduLevelSkillVillageSpan = document.getElementById('edu-level-skill-village');
    const eduLevelSkillFemaleVillageSpan = document.getElementById('edu-level-skill-female-village');
    const eduLevelPostgraduateVillageSpan = document.getElementById('edu-level-postgraduate-village');
    const eduLevelPostgraduateFemaleVillageSpan = document.getElementById('edu-level-postgraduate-female-village');
    const eduLevelOtherVillageSpan = document.getElementById('edu-level-other-village');
    const eduLevelOtherFemaleVillageSpan = document.getElementById('edu-level-other-female-village');

    // Messaging DOM References for Village Dashboard
    const villageBellMailboxButton = document.getElementById('village-bell-mailbox-button');
    const villageUnreadBellCountSpan = document.getElementById('village-unread-bell-count');
    const messageModalVillage = document.getElementById('message-modal-village');
    const closeMessageModalVillageButton = document.getElementById('close-message-modal-village');
    const messageModalTitleVillage = document.getElementById('message-modal-title-village');
    const messageHistoryVillageDiv = document.getElementById('message-history-village');
    const messageComposerVillageDiv = document.getElementById('message-composer-village');
    const messageInputVillage = document.getElementById('message-input-village');
    const sendMessageButtonVillage = document.getElementById('send-message-button-village');
    const messageErrorVillage = document.getElementById('message-error-village');
    // Image related DOM elements for Village
    const imageInputVillage = document.getElementById('image-input-village');
    const imagePreviewVillage = document.getElementById('image-preview-village');
    const removeImageVillageButton = document.getElementById('remove-image-village');
    let selectedImageBase64Village = null;

    const MAX_MEMBERS_DATA_ENTRY = 9;
    const MAX_MEMBERS_EDIT_MODAL = 9;

    const { jsPDF } = window.jspdf;
    const ACTIVITY_LOG_KEY = 'activityLog_v2';
    const MESSAGES_KEY = 'villageMessages_v1';

    const khmerOSFontBase64_Village = 'YOUR_KHMER_OS_BATTAMBANG_BASE64_STRING_HERE';
    const FONT_FILENAME_VFS_VILLAGE = "KhmerOSBattambang-Regular.ttf";
    const FONT_NAME_JSPDF_VILLAGE = "KhmerOSVillageFont";
    let khmerFontLoadedSuccessfully_Village = false;

    async function loadKhmerFontForVillagePDF(doc) {
        if (khmerFontLoadedSuccessfully_Village && doc.getFont().fontName.toLowerCase() === FONT_NAME_JSPDF_VILLAGE.toLowerCase()) {
            doc.setFont(FONT_NAME_JSPDF_VILLAGE); return;
        }
        khmerFontLoadedSuccessfully_Village = false;
        try {
            const isValidBase64 = khmerOSFontBase64_Village && khmerOSFontBase64_Village !== 'YOUR_KHMER_OS_BATTAMBANG_BASE64_STRING_HERE' && khmerOSFontBase64_Village.length > 1000;
            if (isValidBase64) {
                if (!doc.getFileFromVFS(FONT_FILENAME_VFS_VILLAGE)) { doc.addFileToVFS(FONT_FILENAME_VFS_VILLAGE, khmerOSFontBase64_Village); }
                const fontList = doc.getFontList();
                if (!fontList[FONT_NAME_JSPDF_VILLAGE]) { doc.addFont(FONT_FILENAME_VFS_VILLAGE, FONT_NAME_JSPDF_VILLAGE, "normal", "UTF-8"); }
                doc.setFont(FONT_NAME_JSPDF_VILLAGE); khmerFontLoadedSuccessfully_Village = true;
            } else {
                console.warn("Village PDF: Khmer OS font Base64 string is missing, a placeholder, or too short. PDF text might not render Khmer correctly. Falling back to helvetica.");
                doc.setFont("helvetica", "normal");
            }
        } catch (e) { console.error("Village PDF: Error loading/setting Khmer font:", e); doc.setFont("helvetica", "normal"); }
    }

    const displayCurrentDateTimeInKhmer = () => {
        if (!currentDateTimeDisplay) return;
        const now = new Date(); const daysKhmer = ["អាទិត្យ", "ច័ន្ទ", "អង្គារ", "ពុធ", "ព្រហស្បត្តិ៍", "សុក្រ", "សៅរ៍"];
        const monthsKhmer = ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"];
        const dayName = daysKhmer[now.getDay()]; const dayOfMonth = now.getDate(); const monthName = monthsKhmer[now.getMonth()];
        const year = now.getFullYear(); let hours = now.getHours(); const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0'); const ampm = hours >= 12 ? 'ល្ងាច' : 'ព្រឹក';
        hours = hours % 12; hours = hours ? hours : 12; const hoursStr = hours.toString();
        const timeString = `ម៉ោង ${hoursStr}:<span style="color:rgb(42, 40, 167);">${minutes}</span>:<span style="color:rgb(252, 3, 3);">${seconds}</span> ${ampm}`;
        currentDateTimeDisplay.innerHTML = `ថ្ងៃ${dayName} ទី${dayOfMonth} ខែ${monthName} ឆ្នាំ${year} ${timeString}`;
    };
    if (typeof displayCurrentDateTimeInKhmer === 'function') { displayCurrentDateTimeInKhmer(); setInterval(displayCurrentDateTimeInKhmer, 1000); }

    if (dashboardTitle) dashboardTitle.textContent = `ផ្ទាំងគ្រប់គ្រងទិន្នន័យភូមិ ${villageToDisplay}`;
    if (welcomeMessage) {
        welcomeMessage.textContent = isAdminViewing ? `សូមស្វាគមន៍, ${currentAdminUsername || 'Admin'} (កំពុងមើលភូមិ ${villageToDisplay})` : `សូមស្វាគមន៍, មេភូមិ ${villageToDisplay}`;
    }
    if (currentVillageNameStats) currentVillageNameStats.textContent = villageToDisplay;
    if (currentVillageNameAssets) currentVillageNameAssets.textContent = villageToDisplay;
    document.querySelectorAll('.current-village-name-dynamic').forEach(el => el.textContent = villageToDisplay);

    if (isAdminViewing) {
        if (adminViewNotice) adminViewNotice.style.display = 'block';
        if (backToAdminButton) backToAdminButton.style.display = 'inline-block';
        if (dataInputSection) dataInputSection.style.display = 'none';
        if (villageEditPermissionNotice) villageEditPermissionNotice.style.display = 'none';
        if (villageBellMailboxButton) villageBellMailboxButton.style.display = 'none';
    } else { 
        if (adminViewNotice) adminViewNotice.style.display = 'none';
        if (backToAdminButton) backToAdminButton.style.display = 'none';
        if (dataInputSection) dataInputSection.style.display = 'block';
        if (familyDataEntryForm) familyDataEntryForm.style.display = 'none';
        if (toggleFormButton) { toggleFormButton.textContent = 'បង្ហាញទម្រង់បញ្ចូលទិន្នន័យគ្រួសារថ្មី'; toggleFormButton.style.display = 'block';}
        if (villageBellMailboxButton) villageBellMailboxButton.style.display = 'inline-flex';
        if (villageEditPermissionNotice) {
            let permissionText = ''; villageEditPermissionNotice.style.color = ''; villageEditPermissionNotice.style.backgroundColor = '';
            villageEditPermissionNotice.style.borderColor = ''; villageEditPermissionNotice.classList.remove('has-permission', 'no-permission');
            if (villageChiefCanEdit) {
                permissionText = '✅ រដ្ឋបាលឃុំទួលពង្រ បានអនុញ្ញាតឲ្យអ្នកកែសម្រួល ឬលុបទិន្នន័យគ្រួសារ (សូមធ្វើការកែសម្រួលទិន្នន័យ ឬលុបដោយទទួលខុសត្រូវ)។';
                villageEditPermissionNotice.style.color = '#155724'; villageEditPermissionNotice.style.backgroundColor = '#d4edda'; villageEditPermissionNotice.style.borderColor = '#c3e6cb'; 
            } else {
                permissionText = '❌ រដ្ឋបាលឃុំទួលពង្រ មិនទាន់អនុញ្ញាតឲ្យអ្នកកែសម្រួល ឬលុបទិន្នន័យគ្រួសារទេ។ សូមទាក់ទងរដ្ឋបាលឃុំ។';
                villageEditPermissionNotice.style.color = '#721c24'; villageEditPermissionNotice.style.backgroundColor = '#f8d7da'; villageEditPermissionNotice.style.borderColor = '#f5c6cb'; 
            }
            villageEditPermissionNotice.style.padding = '10px'; villageEditPermissionNotice.style.borderRadius = '5px';
            villageEditPermissionNotice.style.marginBottom = '15px'; villageEditPermissionNotice.style.borderWidth = '1px'; 
            villageEditPermissionNotice.style.borderStyle = 'solid'; villageEditPermissionNotice.innerHTML = permissionText;
            villageEditPermissionNotice.style.display = 'block';
        }
    }

    const VILLAGE_DATA_KEY = 'villageData_v2';
    const getVillageDataStorage = () => { const data = localStorage.getItem(VILLAGE_DATA_KEY); try { const parsed = JSON.parse(data); return typeof parsed === 'object' && parsed !== null ? parsed : {}; } catch (e) { console.error("Dashboard: Error parsing village data from localStorage", e); return {}; }};
    const saveVillageDataStorage = (data) => { if (typeof data === 'object' && data !== null) { localStorage.setItem(VILLAGE_DATA_KEY, JSON.stringify(data)); } else { console.error("Dashboard: Attempted to save invalid data to villageData localStorage"); }};
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
        {id: 'vehicleRepairShops', label: 'ជាងជួសជុល(ម៉ូតូ+ឡាន)', type: 'number'}, {id: 'groceryStores', label: 'ផ្ទះលក់ចាប់ហួយ', type: 'number'},
        {id: 'mobilePhoneShops', label: 'ផ្ទះលក់ទូស័ព្ទដៃ', type: 'number'}, {id: 'constructionMaterialDepots', label: 'ដេប៉ូលក់គ្រឿងសំណង់', type: 'number'},
        {id: 'fuelDepots', label: 'ដេប៉ូប្រេង', type: 'number'}, {id: 'beautySalons', label: 'ផ្ទះសម្អាងការ(សាឡន)', type: 'number'},
        {id: 'motorcycles', label: 'ម៉ូតូ', type: 'number'}, {id: 'tukTuks', label: 'ម៉ូតូកង់បី+ម៉ូតូសណ្ដោងរម៉ក់', type: 'number'},
        {id: 'remorques', label: 'ផ្ទះលក់គ្រឿងកសិកម្ម', type: 'number'}
    ];
    const memberFieldDefinitionsForEdit = [
        { classSuffix: 'member-name-edit', prop: 'name', label: 'ឈ្មោះ', required: true, type: 'text' },
        { classSuffix: 'member-gender-edit', prop: 'gender', label: 'ភេទ', type: 'select', options: [{value:'ប្រុស', text:'ប្រុស'}, {value:'ស្រី', text:'ស្រី'}] },
        { classSuffix: 'member-dob-edit', prop: 'dob', label: 'ថ្ងៃខែឆ្នាំកំណើត', type: 'date' },
        { classSuffix: 'member-birthProvince-edit', prop: 'birthProvince', label: 'ខេត្តកំណើត', type: 'text' },
        { classSuffix: 'member-educationLevel-edit', prop: 'educationLevel', label: 'កម្រិតវប្បធម៌', type: 'text' },
        { classSuffix: 'member-occupation-edit', prop: 'occupation', label: 'មុខរបរ', type: 'text' },
        { classSuffix: 'member-nationalId-edit', prop: 'nationalId', label: 'លេខអត្តសញ្ញាណប័ណ្ណ', type: 'text' },
        { classSuffix: 'member-electionOfficeId-edit', prop: 'electionOfficeId', label: 'លេខការិយាល័យបោះឆ្នោត', type: 'text' },
        { classSuffix: 'member-internalMigration-edit', prop: 'internalMigration', label: 'ចំណាកស្រុកក្នុង', type: 'select', options: [{value:'ទេ', text:'ទេ'}, {value:'បាទ', text:'បាទ'}] },
        { classSuffix: 'member-externalMigration-edit', prop: 'externalMigration', label: 'ចំណាកស្រុកក្រៅ', type: 'select', options: [{value:'ទេ', text:'ទេ'}, {value:'បាទ', text:'បាទ'}] }
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

    const getChangedFields = (oldData, newData) => {
        if (!oldData || !newData) return "មិនអាចប្រៀបធៀបទិន្នន័យបានទេ (ទិន្នន័យដើមបាត់)។";
        let changes = []; const formatDisplayValue = (val) => (val === undefined || val === null || String(val).trim() === "") ? "N/A" : String(val).trim();
        if (formatDisplayValue(oldData.familyName) !== formatDisplayValue(newData.familyName)) { changes.push(`ឈ្មោះមេគ្រួសារ: "${formatDisplayValue(oldData.familyName)}" -> "${formatDisplayValue(newData.familyName)}"`);}
        if (formatDisplayValue(oldData.headOfHouseholdPhone) !== formatDisplayValue(newData.headOfHouseholdPhone)) { changes.push(`លេខទូរស័ព្ទមេគ្រួសារ: "${formatDisplayValue(oldData.headOfHouseholdPhone)}" -> "${formatDisplayValue(newData.headOfHouseholdPhone)}"`);}
        const oldMembers = oldData.members || []; const newMembers = newData.members || [];
        if (oldMembers.length !== newMembers.length) { changes.push(`ចំនួនសមាជិក: ${oldMembers.length} -> ${newMembers.length}`);}
        newMembers.forEach(newMember => {
            const oldMember = oldMembers.find(om => om.id === newMember.id);
            if (oldMember) { memberFieldDefinitionsForEdit.forEach(def => { const oldVal = formatDisplayValue(oldMember[def.prop]); const newVal = formatDisplayValue(newMember[def.prop]); if (oldVal !== newVal) { changes.push(`សមាជិក (${newMember.name || newMember.id.slice(-5)}): ${def.label} "${oldVal}" -> "${newVal}"`); }}); }
            else { changes.push(`សមាជិកថ្មី: ${newMember.name || 'N/A'} (ID: ${newMember.id ? newMember.id.slice(-5) : 'New'}) បានបន្ថែម`); }
        });
        oldMembers.forEach(oldMember => { if (!newMembers.find(nm => nm.id === oldMember.id)) { changes.push(`សមាជិក: ${oldMember.name || 'N/A'} (ID: ${oldMember.id.slice(-5)}) ត្រូវបានដកចេញ`);}});
        const oldAssets = oldData.assets || {}; const newAssets = newData.assets || {}; const allAssetKeys = new Set([...Object.keys(oldAssets), ...Object.keys(newAssets)]);
        allAssetKeys.forEach(key => {
            const assetDef = assetFieldDefinitions.find(def => def.id === key); const oldValDisplay = formatDisplayValue(oldAssets[key]); const newValDisplay = formatDisplayValue(newAssets[key]);
            let oldValForCompare = oldAssets[key]; let newValForCompare = newAssets[key];
            if (assetDef && (assetDef.type === 'number' || assetDef.isLandArea)) { oldValForCompare = String(oldValForCompare || "0").trim(); newValForCompare = String(newValForCompare || "0").trim(); }
            else { oldValForCompare = String(oldValForCompare || "").trim(); newValForCompare = String(newValForCompare || "").trim(); }
            if (oldValForCompare !== newValForCompare) { const assetLabel = assetDef?.label || key; changes.push(`${assetLabel}: "${oldValDisplay}" -> "${newValDisplay}"`);}
        });
        if (changes.length === 0) return "មិនមានការផ្លាស់ប្តូរជាក់លាក់ណាមួយត្រូវបានកត់ត្រា។"; return changes.join('; \n');
    };
    
    const addActivityLogEntry = (action, villageName, familyId, familyName = '', oldFamilyData = null, newFamilyData = null, performedByAdminOnVillageDashboard = false) => {
        if (action !== "EDITED_FAMILY" && action !== "DELETED_FAMILY") {
            console.log(`Activity Log: Action "${action}" for family "${familyName || familyId}" in village "${villageName}" will NOT be logged in the village chief activity log.`);
            return; 
        }
        if (!performedByAdminOnVillageDashboard && !isAdminViewing) { 
            if (!villageChiefCanEdit) { 
                console.warn(`Activity log: Village chief ${action} blocked for ${villageName} due to no edit/delete permission.`);
                return; 
            }
        }
        let log = []; const storedLog = localStorage.getItem(ACTIVITY_LOG_KEY);
        if (storedLog) { try { log = JSON.parse(storedLog); if (!Array.isArray(log)) log = []; } catch (e) { console.error("Error parsing activity log:", e); log = []; }}
        let details = '';
        if (action === "EDITED_FAMILY") { if (oldFamilyData && newFamilyData) { details = getChangedFields(oldFamilyData, newFamilyData); } else { details = "ព័ត៌មានលម្អិតអំពីការកែប្រែមិនអាចបង្កើតបាន។"; }}
        else if (action === "DELETED_FAMILY") { details = `គ្រួសារ "${familyName || familyId}" ត្រូវបានលុប។`; }
        const logEntry = { timestamp: new Date().toISOString(), action: action, villageName: villageName, familyId: familyId, familyName: familyName || (newFamilyData ? newFamilyData.familyName : (oldFamilyData ? oldFamilyData.familyName : 'N/A')), modifiedBy: performedByAdminOnVillageDashboard ? (currentAdminUsername ? `Admin: ${currentAdminUsername}` : 'Admin') : `មេភូមិ:${villageName}`, details: details, userAgent: navigator.userAgent };
        log.unshift(logEntry); if (log.length > 100) log = log.slice(0, 100); localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(log));
        console.log(`Activity Log: Action "${action}" for family "${familyName || familyId}" in village "${villageName}" has been logged.`);
    };

    const calculateAge = (dobString) => { if (!dobString) return null; const birthDate = new Date(dobString); if (isNaN(birthDate.valueOf())) return null; const today = new Date(); let age = today.getFullYear() - birthDate.getFullYear(); const monthDifference = today.getMonth() - birthDate.getMonth(); if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) { age--;} return age; };
    const parseLandSize = (textValue) => { if (!textValue || typeof textValue !== 'string') return null; const cleanedValue = textValue.trim().toLowerCase(); const numberMatch = cleanedValue.match(/(\d+(\.\d+)?)/); if (!numberMatch) return null; const value = parseFloat(numberMatch[0]); let unit = 'unknown'; if (cleanedValue.includes('ហិចតា') || cleanedValue.includes('ហិកតា') || cleanedValue.includes('ha')) unit = 'hectare'; else if (cleanedValue.includes('ម៉ែត្រការ៉េ') || cleanedValue.includes('m2')) unit = 'sqm'; else if (cleanedValue.includes('អា') || cleanedValue.endsWith('a') && !cleanedValue.includes('ha')) unit = 'are'; else if (cleanedValue.match(/^(\d+(\.\d+)?)$/)) unit = 'hectare'; return { value, unit }; };
    const convertToHectares = (value, unit) => { if (isNaN(value)) return 0; switch (unit) { case 'hectare': return value; case 'sqm': return value / 10000; case 'are': return value / 100; case 'unknown': return value; default: return 0; }};
    const restrictInput = (inputElement, regexToRemove, maxLength) => { if (!inputElement) return; const originalValue = inputElement.value; let newValue = originalValue.replace(regexToRemove, ''); if (maxLength && newValue.length > maxLength) { newValue = newValue.slice(0, maxLength);} if (newValue !== originalValue) { inputElement.value = newValue;} };

    if (!isAdminViewing) {
        if (familyHeadNameInput) { familyHeadNameInput.addEventListener('input', () => { restrictInput(familyHeadNameInput, /[^a-zA-Z\u1780-\u17FF\s()]/g);});}
        if (familyHeadPhoneInput) { familyHeadPhoneInput.addEventListener('input', () => { restrictInput(familyHeadPhoneInput, /[^0-9+-\s]/g);});}
        if (memberFieldsContainer) {
            memberFieldsContainer.addEventListener('input', (e) => {
                const target = e.target;
                if (target.matches('.member-name') || target.matches('.member-birthProvince') || target.matches('.member-occupation') || target.matches('.member-educationLevel')) { restrictInput(target, /[^a-zA-Z0-9\u1780-\u17FF\s.,()/-]/g);}
                else if (target.matches('.member-nationalId')) { restrictInput(target, /[^0-9]/g, 9);}
                else if (target.matches('.member-electionOfficeId')) { restrictInput(target, /[^0-9]/g, 4);}
            });
        }
    }

    if (toggleFormButton && !isAdminViewing) {
        toggleFormButton.addEventListener('click', () => {
            const isHidden = familyDataEntryForm.style.display === 'none';
            familyDataEntryForm.style.display = isHidden ? 'block' : 'none';
            toggleFormButton.textContent = isHidden ? 'លាក់ទម្រង់បញ្ចូលទិន្នន័យគ្រួសារថ្មី' : 'បង្ហាញទម្រង់បញ្ចូលទិន្នន័យគ្រួសារថ្មី';
            if (isHidden) familyDataEntryForm.scrollIntoView({ behavior: 'smooth' });
        });
    }
    let newFamilyMemberCount = 1;
    if (addMemberButton && !isAdminViewing && memberFieldsContainer) {
        addMemberButton.addEventListener('click', () => {
            if (newFamilyMemberCount < MAX_MEMBERS_DATA_ENTRY) {
                newFamilyMemberCount++; const firstMemberEntry = memberFieldsContainer.querySelector('.member-entry');
                if (!firstMemberEntry) { console.error("Default member entry template not found."); return; }
                const newMemberEntry = firstMemberEntry.cloneNode(true); newMemberEntry.dataset.memberIndex = newFamilyMemberCount - 1;
                const titleElement = newMemberEntry.querySelector('h4'); if(titleElement) titleElement.textContent = `សមាជិកទី ${newFamilyMemberCount}`;
                newMemberEntry.querySelectorAll('input, select').forEach(input => { if (input.type === 'checkbox' || input.type === 'radio') input.checked = false; else if (input.tagName === 'SELECT') input.selectedIndex = 0; else input.value = '';});
                memberFieldsContainer.appendChild(newMemberEntry);
                if (newFamilyMemberCount === MAX_MEMBERS_DATA_ENTRY) { addMemberButton.disabled = true; addMemberButton.textContent = `បានដល់ចំនួនសមាជិកអតិបរមា (${MAX_MEMBERS_DATA_ENTRY})`;}
            }
        });
    }
    const resetNewFamilyFormMemberFields = () => {
        if (!memberFieldsContainer) return;
        while (memberFieldsContainer.children.length > 1) memberFieldsContainer.removeChild(memberFieldsContainer.lastChild);
        const firstMemberEntry = memberFieldsContainer.querySelector('.member-entry');
        if (firstMemberEntry) {
            firstMemberEntry.querySelectorAll('input, select').forEach(input => { if (input.type === 'checkbox' || input.type === 'radio') input.checked = false; else if (input.tagName === 'SELECT') input.selectedIndex = 0; else input.value = '';});
            const titleElement = firstMemberEntry.querySelector('h4'); if(titleElement) titleElement.textContent = `សមាជិកទី 1`;
            firstMemberEntry.dataset.memberIndex = "0";
        }
        newFamilyMemberCount = 1; if (addMemberButton) { addMemberButton.disabled = false; addMemberButton.textContent = "បន្ថែមសមាជិកម្នាក់ទៀត"; }
    };

    const displayVillageAssetSummary = (familiesInVillage) => {
        if (!villageAssetSummaryTbody) return; const assetTotals = {};
        assetFieldDefinitions.forEach(def => { if (def.type === 'number' || def.isLandArea) assetTotals[def.id] = 0;});
        familiesInVillage.forEach(family => {
            if (family.assets) {
                assetFieldDefinitions.forEach(def => {
                    const assetKey = def.id; const assetValue = family.assets[assetKey];
                    if (assetTotals.hasOwnProperty(assetKey) && assetValue !== undefined && assetValue !== null) {
                        if (def.isLandArea) { const parsed = parseLandSize(String(assetValue)); if (parsed) assetTotals[assetKey] += convertToHectares(parsed.value, parsed.unit);}
                        else if (def.type === 'number') { const value = parseInt(assetValue, 10); if (!isNaN(value)) assetTotals[assetKey] += value;}
                    }
                });
            }
        });
        villageAssetSummaryTbody.innerHTML = ''; let hasAnyAssetsData = false;
        assetFieldDefinitions.forEach(def => {
            const row = villageAssetSummaryTbody.insertRow(); row.insertCell().textContent = def.label; const totalCell = row.insertCell();
            if (assetTotals.hasOwnProperty(def.id)) {
                const totalValue = assetTotals[def.id]; if (totalValue > 0 || (def.isLandArea && totalValue !== undefined && totalValue !== null && totalValue !== 0)) hasAnyAssetsData = true;
                if (def.isLandArea) { const formattedHectares = parseFloat(totalValue.toFixed(4)); totalCell.textContent = `${formattedHectares} ហិចតា`;}
                else { totalCell.textContent = totalValue;}
            } else { totalCell.textContent = def.isLandArea ? '0 ហិចតា' : (def.type === 'number' ? '0' : '-');}
        });
        if (!hasAnyAssetsData && familiesInVillage.length > 0) { villageAssetSummaryTbody.innerHTML = '<tr><td colspan="2"><em>មិនមានទិន្នន័យទ្រព្យសម្បត្តិសម្រាប់គណនា។</em></td></tr>';}
        else if (familiesInVillage.length === 0) { villageAssetSummaryTbody.innerHTML = '<tr><td colspan="2"><em>មិនមានទិន្នន័យគ្រួសារដើម្បីគណនា។</em></td></tr>';}
    };

    const printSingleFamilyDataForVillagePDF = async (familyData, villageName) => {
        if (!familyData) { alert("មិនមានទិន្នន័យគ្រួសារសម្រាប់បោះពុម្ពទេ។"); return; }
        khmerFontLoadedSuccessfully_Village = false; const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
        await loadKhmerFontForVillagePDF(doc); let yPosition = 15; const lineHeight = 7; const indent = 15;
        const pageWidth = doc.internal.pageSize.getWidth(); const contentWidth = pageWidth - (indent * 2);
        doc.setFontSize(16); doc.text(`បញ្ជីទិន្នន័យគ្រួសារ`, pageWidth / 2, yPosition, { align: 'center' }); yPosition += lineHeight * 1.5;
        doc.setFontSize(12); doc.text(`ឈ្មោះមេគ្រួសារ: ${familyData.familyName || 'N/A'}`, indent, yPosition); yPosition += lineHeight;
        doc.text(`ភូមិ: ${villageName || 'N/A'}`, indent, yPosition); yPosition += lineHeight;
        try { doc.text(`កាលបរិច្ឆេទបញ្ចូល: ${new Date(familyData.entryDate).toLocaleDateString('km-KH', { day: '2-digit', month: 'long', year: 'numeric' })}`, indent, yPosition);}
        catch { doc.text(`កាលបរិច្ឆេទបញ្ចូល: មិនត្រឹមត្រូវ`, indent, yPosition);} yPosition += lineHeight;
        if (familyData.headOfHouseholdPhone) { doc.text(`លេខទូរស័ព្ទមេគ្រួសារ: ${familyData.headOfHouseholdPhone}`, indent, yPosition); yPosition += lineHeight;}
        yPosition += lineHeight * 0.5; doc.setFontSize(13); doc.text("សមាជិកគ្រួសារ:", indent, yPosition); yPosition += lineHeight;
        if (familyData.members && familyData.members.length > 0) {
            const memberTableHeaders = [ "ល.រ", "ឈ្មោះ", "ភេទ", "ថ្ងៃខែឆ្នាំកំណើត", "ខេត្តកំណើត", "កម្រិតវប្បធម៌", "មុខរបរ", "លេខអត្ត.", "លេខការិ.", "ចំណាកស្រុកក្នុង", "ចំណាកស្រុកក្រៅ"];
            const memberTableBody = familyData.members.map((member, index) => [ index + 1, member.name || 'N/A', member.gender || 'N/A', member.dob ? new Date(member.dob).toLocaleDateString('km-KH', {day:'2-digit', month:'2-digit', year:'numeric'}) : 'N/A', member.birthProvince || 'N/A', member.educationLevel || 'N/A', member.occupation || 'N/A', member.nationalId || 'N/A', member.electionOfficeId || 'N/A', member.internalMigration === 'បាទ' ? 'បាទ' : 'ទេ', member.externalMigration === 'បាទ' ? 'បាទ' : 'ទេ']);
            doc.autoTable({ startY: yPosition, head: [memberTableHeaders], body: memberTableBody, theme: 'grid', headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0], font: FONT_NAME_JSPDF_VILLAGE, fontSize: 8, halign: 'center' }, bodyStyles: { font: FONT_NAME_JSPDF_VILLAGE, fontSize: 7.5, cellPadding: 1.5, }, columnStyles: { 0: { cellWidth: 8, halign: 'center' }, 7: { cellWidth: 15 }, 8: { cellWidth: 15 }, 9: { cellWidth: 12, halign: 'center'}, 10: {cellWidth: 12, halign: 'center'} }, margin: { left: indent, right: indent }, tableWidth: 'auto', didDrawPage: async function (data) { await loadKhmerFontForVillagePDF(doc);}});
            yPosition = doc.lastAutoTable.finalY + lineHeight;
        } else { doc.setFontSize(10); doc.text("មិនមានសមាជិកគ្រួសារ។", indent + 5, yPosition); yPosition += lineHeight;}
        yPosition += lineHeight * 0.5; if (yPosition > doc.internal.pageSize.getHeight() - 40) { doc.addPage(); yPosition = 15; await loadKhmerFontForVillagePDF(doc);}
        doc.setFontSize(13); doc.text("ទ្រព្យសម្បត្តិ និងអាជីវកម្ម:", indent, yPosition); yPosition += lineHeight; doc.setFontSize(10);
        let hasAssets = false;
        if (familyData.assets && typeof familyData.assets === 'object' && Object.keys(familyData.assets).length > 0) {
            for (const def of assetFieldDefinitions) {
                const assetValue = familyData.assets[def.id];
                if (assetValue !== undefined && assetValue !== null && String(assetValue).trim() !== "" && String(assetValue).trim() !== "0") {
                    if (yPosition > doc.internal.pageSize.getHeight() - 20) { doc.addPage(); yPosition = 15; await loadKhmerFontForVillagePDF(doc); doc.setFontSize(10);}
                    const textToPrint = `  • ${def.label}: ${assetValue}`; const textLines = doc.splitTextToSize(textToPrint, contentWidth - 8);
                    doc.text(textLines, indent + 2, yPosition); yPosition += (lineHeight - 2) * textLines.length; hasAssets = true;
                }
            }
        }
        if (!hasAssets) { if (yPosition > doc.internal.pageSize.getHeight() - 20) { doc.addPage(); yPosition = 15; await loadKhmerFontForVillagePDF(doc); doc.setFontSize(10);} doc.text("  មិនមានទ្រព្យសម្បត្តិ/អាជីវកម្មដែលបានរាយការណ៍។", indent + 2, yPosition); yPosition += lineHeight;}
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i); await loadKhmerFontForVillagePDF(doc); doc.setFontSize(9);
            doc.text(`ទំព័រ ${i} នៃ ${pageCount}`, pageWidth - indent, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
            doc.text(`បោះពុម្ពថ្ងៃទី: ${new Date().toLocaleDateString('km-KH', {day:'2-digit', month:'long', year:'numeric'})} ដោយមេភូមិ ${villageToDisplay}`, indent, doc.internal.pageSize.getHeight() - 10);
        }
        doc.save(`បញ្ជីទិន្នន័យគ្រួសារ-${familyData.familyName || familyData.familyId}-${villageName}.pdf`);
        alert("ការបង្កើត PDF បានបញ្ចប់។ សូមពិនិត្យមើលឯកសារដែលបានទាញយក។");
    };

    const renderSingleFamilyCard = (family, containerElement, currentVillageForActions) => {
         if (!familyCardTemplate || !familyCardTemplate.content) { console.error("Dashboard: Family card template or its content is missing!"); return; }
         const cardClone = familyCardTemplate.content.cloneNode(true); const familyCard = cardClone.querySelector('.family-card');
         if (!familyCard) { console.error("Dashboard: '.family-card' element not found in template!"); return;}
         familyCard.dataset.familyId = family.familyId;
         const cardNameEl = familyCard.querySelector('.family-card-name'); if(cardNameEl) cardNameEl.textContent = family.familyName || 'N/A';
         const cardPhoneEl = familyCard.querySelector('.family-card-phone');
         if (cardPhoneEl) { cardPhoneEl.textContent = family.headOfHouseholdPhone ? `ទូរស័ព្ទ: ${family.headOfHouseholdPhone}` : ''; cardPhoneEl.style.display = family.headOfHouseholdPhone ? 'block' : 'none';}
         const cardDateEl = familyCard.querySelector('.family-card-entry-date');
         if(cardDateEl) { try { cardDateEl.textContent = `កាលបរិច្ឆេទបញ្ចូល: ${new Date(family.entryDate).toLocaleDateString('km-KH', { day: '2-digit', month: 'short', year: 'numeric' })}`;} catch (e) { cardDateEl.textContent = `កាលបរិច្ឆេទបញ្ចូល: មិនត្រឹមត្រូវ`;}}
         const membersTableBody = familyCard.querySelector('.members-table tbody'); let familyMemberCount = 0;
         if (family.members && Array.isArray(family.members) && membersTableBody) {
             familyMemberCount = family.members.length; membersTableBody.innerHTML = '';
             if (familyMemberCount > 0) {
                family.members.forEach(member => {
                    const row = membersTableBody.insertRow(); row.insertCell().textContent = member.name || 'N/A'; row.insertCell().textContent = member.gender || 'N/A';
                    row.insertCell().textContent = member.dob ? new Date(member.dob).toLocaleDateString('km-KH', {day:'2-digit', month:'2-digit', year:'numeric'}) : 'N/A';
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
             assetsDiv.innerHTML = ''; let hasReportedAssetsInCard = false;
             if (family.assets && typeof family.assets === 'object') {
                 assetFieldDefinitions.forEach(def => {
                     const assetValue = family.assets[def.id];
                     if (assetValue !== undefined && assetValue !== null && String(assetValue).trim() !== "" && String(assetValue).trim() !== "0") {
                         const p = document.createElement('p'); p.innerHTML = `<strong>${def.label}:</strong> ${assetValue}`; assetsDiv.appendChild(p); hasReportedAssetsInCard = true;
                     }
                 });
             }
             if (!hasReportedAssetsInCard) { assetsDiv.innerHTML = '<p><em>មិនមានទ្រព្យសម្បត្តិ/អាជីវកម្មដែលបានរាយការណ៍។</em></p>';}
         }
         const actionsDiv = familyCard.querySelector('.family-card-actions');
         if (actionsDiv) {
            const canPerformEditDelete = isAdminViewing || (!isAdminViewing && villageChiefCanEdit); const canVillageChiefPrint = !isAdminViewing;
            if (canPerformEditDelete || canVillageChiefPrint) {
                 actionsDiv.style.display = 'block';
                 const editBtn = actionsDiv.querySelector('.edit-family-button'); const deleteBtn = actionsDiv.querySelector('.delete-family-button'); const printBtnVillage = actionsDiv.querySelector('.print-family-button-village');
                 if (editBtn) { editBtn.style.display = canPerformEditDelete ? 'inline-block' : 'none'; if (canPerformEditDelete) editBtn.onclick = () => openEditFamilyModal(currentVillageForActions, family.familyId, family);}
                 if (deleteBtn) { deleteBtn.style.display = canPerformEditDelete ? 'inline-block' : 'none'; if (canPerformEditDelete) deleteBtn.onclick = () => deleteFamilyData(currentVillageForActions, family.familyId, family.familyName);}
                 if (printBtnVillage) { printBtnVillage.style.display = canVillageChiefPrint ? 'inline-block' : 'none'; if (canVillageChiefPrint) { printBtnVillage.onclick = () => printSingleFamilyDataForVillagePDF(family, currentVillageForActions);}}
            } else { actionsDiv.style.display = 'none';}
         }
         containerElement.appendChild(cardClone);
    };

    const loadVillageFamilyData = (searchTerm = '') => {
        if (!familyListContainer || !familyCardTemplate) { console.warn("Dashboard: Family list container or card template missing."); return;}
        if (searchVillageInput && !searchTerm) searchVillageInput.value = '';
        const allVillageData = getVillageDataStorage();
        let familiesInVillage = (allVillageData.hasOwnProperty(villageToDisplay) && Array.isArray(allVillageData[villageToDisplay])) ? [...allVillageData[villageToDisplay]] : [];
        if(familyListContainer) familyListContainer.innerHTML = '';
        const searchTermLower = searchTerm.trim().toLowerCase(); let familiesToDisplay = familiesInVillage;
        if (searchTermLower) {
            familiesToDisplay = familiesInVillage.filter(family => { let match = false; if (family.familyName && family.familyName.toLowerCase().includes(searchTermLower)) match = true; if (!match && family.members && Array.isArray(family.members)) { for (const mem of family.members) { if ((mem.name && mem.name.toLowerCase().includes(searchTermLower)) || (mem.nationalId && mem.nationalId.includes(searchTermLower))) { match = true; break;}}} return match; });
        }
        if (familiesToDisplay.length > 0) {
            if(noFamilyDataMessage) noFamilyDataMessage.style.display = 'none';
            familiesToDisplay.sort((a, b) => new Date(b.entryDate) - new Date(a.entryDate));
            familiesToDisplay.forEach(family => { renderSingleFamilyCard(family, familyListContainer, villageToDisplay);});
        } else {
             if(noFamilyDataMessage) { noFamilyDataMessage.textContent = searchTermLower ? `រកមិនឃើញលទ្ធផលសម្រាប់ "${searchTerm}" ក្នុងភូមិ ${villageToDisplay} ទេ។` : `មិនទាន់មានទិន្នន័យគ្រួសារសម្រាប់ភូមិ ${villageToDisplay} ទេ។`; noFamilyDataMessage.style.display = 'block';}
        }
        let totalPeople = 0, totalFemales = 0, todayEntriesCount = 0, totalInternalMigrants = 0, totalExternalMigrants = 0, femaleInternalMigrants = 0, femaleExternalMigrants = 0;
        const todayDateString = new Date().toISOString().split('T')[0];
        let count0_2_Village = 0, count0_2_Female_Village = 0, count3_4_Village = 0, count3_4_Female_Village = 0, count5_5_Village = 0, count5_5_Female_Village = 0, count6_6_Village = 0, count6_6_Female_Village = 0, count7_11_Village = 0, count7_11_Female_Village = 0, count12_14_Village = 0, count12_14_Female_Village = 0, count15_17_Village = 0, count15_17_Female_Village = 0, count18_24_Village = 0, count18_24_Female_Village = 0, count25_35_Village = 0, count25_35_Female_Village = 0, count36_45_Village = 0, count36_45_Female_Village = 0, count46_60_Village = 0, count46_60_Female_Village = 0, count61_Plus_Village = 0, count61_Plus_Female_Village = 0;
        const educationStats = {}; Object.keys(trackedEducationLevels).forEach(eduKey => { educationStats[eduKey] = { total: 0, female: 0 }; });
        const fullDataForStats = (allVillageData.hasOwnProperty(villageToDisplay) && Array.isArray(allVillageData[villageToDisplay])) ? allVillageData[villageToDisplay] : [];
        fullDataForStats.forEach(family => {
            if (family.members && Array.isArray(family.members)) {
                totalPeople += family.members.length;
                family.members.forEach(member => {
                    if (member.gender === 'ស្រី') totalFemales++;
                    if (member.internalMigration === 'បាទ') { totalInternalMigrants++; if (member.gender === 'ស្រី') femaleInternalMigrants++;}
                    if (member.externalMigration === 'បាទ') { totalExternalMigrants++; if (member.gender === 'ស្រី') femaleExternalMigrants++;}
                    const age = calculateAge(member.dob);
                    if (age !== null) {
                        if (age <= 2) { count0_2_Village++; if(member.gender === 'ស្រី') count0_2_Female_Village++; } else if (age <= 4) { count3_4_Village++; if(member.gender === 'ស្រី') count3_4_Female_Village++; }
                        else if (age === 5) { count5_5_Village++; if(member.gender === 'ស្រី') count5_5_Female_Village++; } else if (age === 6) { count6_6_Village++; if(member.gender === 'ស្រី') count6_6_Female_Village++; }
                        else if (age <= 11) { count7_11_Village++; if(member.gender === 'ស្រី') count7_11_Female_Village++; } else if (age <= 14) { count12_14_Village++; if(member.gender === 'ស្រី') count12_14_Female_Village++; }
                        else if (age <= 17) { count15_17_Village++; if(member.gender === 'ស្រី') count15_17_Female_Village++; } else if (age <= 24) { count18_24_Village++; if(member.gender === 'ស្រី') count18_24_Female_Village++; }
                        else if (age <= 35) { count25_35_Village++; if(member.gender === 'ស្រី') count25_35_Female_Village++; } else if (age <= 45) { count36_45_Village++; if(member.gender === 'ស្រី') count36_45_Female_Village++; }
                        else if (age <= 60) { count46_60_Village++; if(member.gender === 'ស្រី') count46_60_Female_Village++; } else { count61_Plus_Village++; if(member.gender === 'ស្រី') count61_Plus_Female_Village++; }
                    }
                    const categorizedEdu = categorizeEducation(member.educationLevel || "");
                    if (educationStats[categorizedEdu]) { educationStats[categorizedEdu].total++; if (member.gender === 'ស្រី') educationStats[categorizedEdu].female++;}
                    else { educationStats["ផ្សេងៗ"].total++; if (member.gender === 'ស្រី') educationStats["ផ្សេងៗ"].female++;}
                });
            }
            if (family.entryDate && typeof family.entryDate === 'string' && family.entryDate.startsWith(todayDateString)) { todayEntriesCount++;}
        });
        if(totalFamiliesVillageSpan) totalFamiliesVillageSpan.textContent = fullDataForStats.length; if(totalPeopleVillageSpan) totalPeopleVillageSpan.textContent = totalPeople; if(totalFemalesVillageSpan) totalFemalesVillageSpan.textContent = totalFemales; if(todayEntriesVillageSpan) todayEntriesVillageSpan.textContent = todayEntriesCount;
        if(totalInternalMigrantsVillageSpan) totalInternalMigrantsVillageSpan.textContent = totalInternalMigrants; if(totalInternalMigrantsFemaleVillageSpan) totalInternalMigrantsFemaleVillageSpan.textContent = femaleInternalMigrants;
        if(totalExternalMigrantsVillageSpan) totalExternalMigrantsVillageSpan.textContent = totalExternalMigrants; if(totalExternalMigrantsFemaleVillageSpan) totalExternalMigrantsFemaleVillageSpan.textContent = femaleExternalMigrants;
        if(ageGroup0_2_VillageSpan) ageGroup0_2_VillageSpan.textContent = count0_2_Village; if(ageGroup0_2_Female_VillageSpan) ageGroup0_2_Female_VillageSpan.textContent = count0_2_Female_Village; if(ageGroup3_4_VillageSpan) ageGroup3_4_VillageSpan.textContent = count3_4_Village; if(ageGroup3_4_Female_VillageSpan) ageGroup3_4_Female_VillageSpan.textContent = count3_4_Female_Village;
        if(ageGroup5_5_VillageSpan) ageGroup5_5_VillageSpan.textContent = count5_5_Village; if(ageGroup5_5_Female_VillageSpan) ageGroup5_5_Female_VillageSpan.textContent = count5_5_Female_Village; if(ageGroup6_6_VillageSpan) ageGroup6_6_VillageSpan.textContent = count6_6_Village; if(ageGroup6_6_Female_VillageSpan) ageGroup6_6_Female_VillageSpan.textContent = count6_6_Female_Village;
        if(ageGroup7_11_VillageSpan) ageGroup7_11_VillageSpan.textContent = count7_11_Village; if(ageGroup7_11_Female_VillageSpan) ageGroup7_11_Female_VillageSpan.textContent = count7_11_Female_Village; if(ageGroup12_14_VillageSpan) ageGroup12_14_VillageSpan.textContent = count12_14_Village; if(ageGroup12_14_Female_VillageSpan) ageGroup12_14_Female_VillageSpan.textContent = count12_14_Female_Village;
        if(ageGroup15_17_VillageSpan) ageGroup15_17_VillageSpan.textContent = count15_17_Village; if(ageGroup15_17_Female_VillageSpan) ageGroup15_17_Female_VillageSpan.textContent = count15_17_Female_Village; if(ageGroup18_24_VillageSpan) ageGroup18_24_VillageSpan.textContent = count18_24_Village; if(ageGroup18_24_Female_VillageSpan) ageGroup18_24_Female_VillageSpan.textContent = count18_24_Female_Village;
        if(ageGroup25_35_VillageSpan) ageGroup25_35_VillageSpan.textContent = count25_35_Village; if(ageGroup25_35_Female_VillageSpan) ageGroup25_35_Female_VillageSpan.textContent = count25_35_Female_Village; if(ageGroup36_45_VillageSpan) ageGroup36_45_VillageSpan.textContent = count36_45_Village; if(ageGroup36_45_Female_VillageSpan) ageGroup36_45_Female_VillageSpan.textContent = count36_45_Female_Village;
        if(ageGroup46_60_VillageSpan) ageGroup46_60_VillageSpan.textContent = count46_60_Village; if(ageGroup46_60_Female_VillageSpan) ageGroup46_60_Female_VillageSpan.textContent = count46_60_Female_Village; if(ageGroup61_Plus_VillageSpan) ageGroup61_Plus_VillageSpan.textContent = count61_Plus_Village; if(ageGroup61_Plus_Female_VillageSpan) ageGroup61_Plus_Female_VillageSpan.textContent = count61_Plus_Female_Village;
        if(eduLevelUneducatedVillageSpan) eduLevelUneducatedVillageSpan.textContent = educationStats["មិនបានសិក្សា"].total; if(eduLevelUneducatedFemaleVillageSpan) eduLevelUneducatedFemaleVillageSpan.textContent = educationStats["មិនបានសិក្សា"].female;
        if(eduLevelPrimaryVillageSpan) eduLevelPrimaryVillageSpan.textContent = educationStats["បឋមសិក្សា"].total; if(eduLevelPrimaryFemaleVillageSpan) eduLevelPrimaryFemaleVillageSpan.textContent = educationStats["បឋមសិក្សា"].female;
        if(eduLevelLowerSecondaryVillageSpan) eduLevelLowerSecondaryVillageSpan.textContent = educationStats["អនុវិទ្យាល័យ"].total; if(eduLevelLowerSecondaryFemaleVillageSpan) eduLevelLowerSecondaryFemaleVillageSpan.textContent = educationStats["អនុវិទ្យាល័យ"].female;
        if(eduLevelHighSchoolVillageSpan) eduLevelHighSchoolVillageSpan.textContent = educationStats["វិទ្យាល័យ"].total; if(eduLevelHighSchoolFemaleVillageSpan) eduLevelHighSchoolFemaleVillageSpan.textContent = educationStats["វិទ្យាល័យ"].female;
        if(eduLevelBachelorVillageSpan) eduLevelBachelorVillageSpan.textContent = educationStats["បរិញ្ញាបត្រ"].total; if(eduLevelBachelorFemaleVillageSpan) eduLevelBachelorFemaleVillageSpan.textContent = educationStats["បរិញ្ញាបត្រ"].female;
        if(eduLevelSkillVillageSpan) eduLevelSkillVillageSpan.textContent = educationStats["ជំនាញ"].total; if(eduLevelSkillFemaleVillageSpan) eduLevelSkillFemaleVillageSpan.textContent = educationStats["ជំនាញ"].female;
        if(eduLevelPostgraduateVillageSpan) eduLevelPostgraduateVillageSpan.textContent = educationStats["លើសបរិញ្ញាបត្រ"].total; if(eduLevelPostgraduateFemaleVillageSpan) eduLevelPostgraduateFemaleVillageSpan.textContent = educationStats["លើសបរិញ្ញាបត្រ"].female;
        if(eduLevelOtherVillageSpan) eduLevelOtherVillageSpan.textContent = educationStats["ផ្សេងៗ"].total; if(eduLevelOtherFemaleVillageSpan) eduLevelOtherFemaleVillageSpan.textContent = educationStats["ផ្សេងៗ"].female;
        displayVillageAssetSummary(fullDataForStats);
    };

    if (familyDataEntryForm && !isAdminViewing) {
        familyDataEntryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if(dataEntrySuccessMsg) dataEntrySuccessMsg.textContent = ''; if(dataEntryErrorMsg) dataEntryErrorMsg.textContent = '';
            const familyHeadNameValue = familyHeadNameInput ? familyHeadNameInput.value.trim() : "";
            const headOfHouseholdPhoneValue = familyHeadPhoneInput ? familyHeadPhoneInput.value.trim() : "";
            if (!familyHeadNameValue) { if(dataEntryErrorMsg) dataEntryErrorMsg.textContent = 'សូមបញ្ចូលឈ្មោះមេគ្រួសារ។'; if(familyHeadNameInput) familyHeadNameInput.focus(); return; }
            const memberEntries = memberFieldsContainer.querySelectorAll('.member-entry');
            for (let i = 0; i < memberEntries.length; i++) {
                const entry = memberEntries[i]; const memberNameInput = entry.querySelector('.member-name');
                const nationalIdInput = entry.querySelector('.member-nationalId'); const electionOfficeIdInput = entry.querySelector('.member-electionOfficeId');
                const memberName = memberNameInput ? memberNameInput.value.trim() : '';
                if (memberName) {
                    const nationalIdValue = nationalIdInput ? nationalIdInput.value.trim() : '';
                    if (nationalIdValue !== "" && nationalIdValue.length !== 9) { if(dataEntryErrorMsg) dataEntryErrorMsg.textContent = `សមាជិក "${memberName}"៖ លេខអត្តសញ្ញាណប័ណ្ណត្រូវតែមាន 9 ខ្ទង់ (បើមានបញ្ចូល)។`; if(nationalIdInput) nationalIdInput.focus(); return; }
                    const electionOfficeIdValue = electionOfficeIdInput ? electionOfficeIdInput.value.trim() : '';
                    if (electionOfficeIdValue !== "" && electionOfficeIdValue.length !== 4) { if(dataEntryErrorMsg) dataEntryErrorMsg.textContent = `សមាជិក "${memberName}"៖ លេខការិយាល័យបោះឆ្នោតត្រូវតែមាន 4 ខ្ទង់ (បើមានបញ្ចូល)។`; if(electionOfficeIdInput) electionOfficeIdInput.focus(); return;}
                }
            }
            const newFamilyData = { familyId: `fam_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`, familyName: familyHeadNameValue, headOfHouseholdPhone: headOfHouseholdPhoneValue, entryDate: new Date().toISOString(), members: [], assets: {}, enteredBy: currentVillageIdForMessaging, lastModifiedBy: currentVillageIdForMessaging, lastModifiedDate: new Date().toISOString() };
            let hasAtLeastOneValidMember = false;
            if (memberFieldsContainer) {
                memberFieldsContainer.querySelectorAll('.member-entry').forEach(entry => {
                    const name = entry.querySelector('.member-name')?.value.trim();
                    if (name) {
                        hasAtLeastOneValidMember = true;
                        newFamilyData.members.push({ id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`, name: name, gender: entry.querySelector('.member-gender')?.value || 'ប្រុស', dob: entry.querySelector('.member-dob')?.value || null, birthProvince: entry.querySelector('.member-birthProvince')?.value.trim() || null, educationLevel: entry.querySelector('.member-educationLevel')?.value.trim() || null, occupation: entry.querySelector('.member-occupation')?.value.trim() || null, nationalId: entry.querySelector('.member-nationalId')?.value.trim() || null, electionOfficeId: entry.querySelector('.member-electionOfficeId')?.value.trim() || null, internalMigration: entry.querySelector('.member-internalMigration')?.value || 'ទេ', externalMigration: entry.querySelector('.member-externalMigration')?.value || 'ទេ', });
                    }
                });
            }
            const assetInputs = familyDataEntryForm.querySelectorAll('.asset-grid input, .asset-grid textarea');
            assetInputs.forEach(input => {
                const assetDef = assetFieldDefinitions.find(def => def.id === input.id); let value;
                if (assetDef?.isLandArea) { value = input.value.trim() || "0"; } else if (input.type === 'number') { value = parseInt(input.value, 10) || 0;} else { value = input.value.trim() || "";}
                newFamilyData.assets[input.id] = value;
            });
            const allVillageData = getVillageDataStorage();
            if (!allVillageData.hasOwnProperty(villageToDisplay) || !Array.isArray(allVillageData[villageToDisplay])) { allVillageData[villageToDisplay] = [];}
            allVillageData[villageToDisplay].push(newFamilyData); saveVillageDataStorage(allVillageData);
            addActivityLogEntry("ADDED_FAMILY", villageToDisplay, newFamilyData.familyId, newFamilyData.familyName, null, newFamilyData, false );
            if(dataEntrySuccessMsg) dataEntrySuccessMsg.textContent = 'ទិន្នន័យគ្រួសារត្រូវបានបញ្ចូលដោយជោគជ័យ!';
            if(familyDataEntryForm) familyDataEntryForm.reset(); resetNewFamilyFormMemberFields();
            loadVillageFamilyData(searchVillageInput ? searchVillageInput.value : '');
            setTimeout(() => { if(dataEntrySuccessMsg) dataEntrySuccessMsg.textContent = ''; }, 4000);
        });
    }

    const updateVillageUnreadCount = () => {
        if (isAdminViewing || !villageUnreadBellCountSpan) return;
        const allMessages = getMessages();
        const unread = allMessages.filter(msg => msg.to === currentVillageIdForMessaging && msg.from === adminIdForMessaging && !msg.readByReceiver).length;
        villageUnreadBellCountSpan.textContent = unread;
        villageUnreadBellCountSpan.style.display = unread > 0 ? 'inline-block' : 'none';
    };

    const markVillageMessagesAsRead = () => {
        if (isAdminViewing) return; let messages = getMessages(); let changed = false;
        messages.forEach(msg => { if (msg.to === currentVillageIdForMessaging && msg.from === adminIdForMessaging && !msg.readByReceiver) { msg.readByReceiver = true; changed = true; }});
        if (changed) saveMessages(messages); updateVillageUnreadCount();
    };

    const displayVillageChatHistory = () => {
        if (isAdminViewing || !messageHistoryVillageDiv) return; messageHistoryVillageDiv.innerHTML = '';
        const allMessages = getMessages();
        const chatMessages = allMessages.filter(msg => (msg.from === currentVillageIdForMessaging && msg.to === adminIdForMessaging) || (msg.from === adminIdForMessaging && msg.to === currentVillageIdForMessaging)).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        if (chatMessages.length === 0) { messageHistoryVillageDiv.innerHTML = `<p style="text-align:center; color:#777;"><em>មិនមានសារជាមួយ Admin ទេ។</em></p>`; return; }
        chatMessages.forEach(msg => {
            const bubble = document.createElement('div'); bubble.classList.add('message-bubble'); bubble.classList.add(msg.from === currentVillageIdForMessaging ? 'sent' : 'received');
            const senderNameDiv = document.createElement('div'); senderNameDiv.classList.add('message-sender-name'); senderNameDiv.textContent = msg.from === currentVillageIdForMessaging ? villageToDisplay : (adminIdForMessaging.split(':')[1] || 'Admin');
            const contentDiv = document.createElement('div'); contentDiv.classList.add('message-content'); contentDiv.textContent = msg.content;
            bubble.appendChild(senderNameDiv); bubble.appendChild(contentDiv);
            if (msg.imageContent) {
                const imgElement = document.createElement('img'); imgElement.src = msg.imageContent;
                imgElement.style.maxWidth = '100%'; imgElement.style.maxHeight = '200px'; imgElement.style.borderRadius = '10px';
                imgElement.style.marginTop = '5px'; imgElement.alt = "រូបភាពដែលបានផ្ញើ";
                bubble.appendChild(imgElement);
            }
            const timestampDiv = document.createElement('div'); timestampDiv.classList.add('message-timestamp'); timestampDiv.textContent = new Date(msg.timestamp).toLocaleString('km-KH', { hour: '2-digit', minute: '2-digit', day:'2-digit', month:'short' });
            bubble.appendChild(timestampDiv); messageHistoryVillageDiv.appendChild(bubble);
        });
        messageHistoryVillageDiv.scrollTop = messageHistoryVillageDiv.scrollHeight; markVillageMessagesAsRead();
    };

    const openVillageMessageModal = () => {
        if (isAdminViewing || !messageModalVillage || !messageModalTitleVillage || !messageComposerVillageDiv) return;
        if (imageInputVillage) imageInputVillage.value = '';
        if (imagePreviewVillage) imagePreviewVillage.style.display = 'none';
        if (removeImageVillageButton) removeImageVillageButton.style.display = 'none';
        selectedImageBase64Village = null;
        const adminDisplayName = adminIdForMessaging.split(':')[1] || 'Admin';
        messageModalTitleVillage.textContent = `ផ្ញើសារទៅ ${adminDisplayName}`;
        displayVillageChatHistory(); messageComposerVillageDiv.style.display = 'block';
        messageInputVillage.value = ''; messageInputVillage.focus();
        if(messageErrorVillage) messageErrorVillage.textContent = '';
        messageModalVillage.style.display = 'block'; updateVillageUnreadCount();
    };

    // Event listener for image input - VILLAGE
if (imageInputVillage && imagePreviewVillage && removeImageVillageButton && !isAdminViewing) {
    imageInputVillage.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            // if (file.size > 3 * 1024 * 1024) { // 3MB limit
            if (file.size > 5 * 1024 * 1024) { // CHANGED TO 5MB limit
                alert('រូបភាពធំពេក! សូមជ្រើសរើសរូបភាពតូចជាង 5MB។'); // Update alert message
                imageInputVillage.value = "";
                imagePreviewVillage.style.display = 'none';
                removeImageVillageButton.style.display = 'none';
                selectedImageBase64Village = null;
                return;
            }
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreviewVillage.src = e.target.result;
                imagePreviewVillage.style.display = 'block';
                removeImageVillageButton.style.display = 'inline-block';
                selectedImageBase64Village = e.target.result;
            }
            reader.readAsDataURL(file);
        } else {
            imagePreviewVillage.style.display = 'none';
            removeImageVillageButton.style.display = 'none';
            selectedImageBase64Village = null;
        }
    });
    // ... rest of the listener
}

    if (sendMessageButtonVillage && !isAdminViewing) {
        sendMessageButtonVillage.addEventListener('click', () => {
            if (!messageInputVillage) return; const content = messageInputVillage.value.trim();
            if (!adminIdForMessaging) { if(messageErrorVillage) messageErrorVillage.textContent = 'មិនអាចកំណត់ Admin អ្នកទទួល។'; return; }
            if (!content && !selectedImageBase64Village) { if(messageErrorVillage) messageErrorVillage.textContent = 'ខ្លឹមសារសារ ឬរូបភាពមិនអាចទទេបានទេ។'; return; }
            const newMessage = { id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`, from: currentVillageIdForMessaging, to: adminIdForMessaging, content: content, imageContent: selectedImageBase64Village, timestamp: new Date().toISOString(), readByReceiver: false };
            let messages = getMessages(); messages.push(newMessage); saveMessages(messages);
            messageInputVillage.value = '';
            if(imageInputVillage) imageInputVillage.value = '';
            if(imagePreviewVillage) imagePreviewVillage.style.display = 'none';
            if(removeImageVillageButton) removeImageVillageButton.style.display = 'none';
            selectedImageBase64Village = null;
            if(messageErrorVillage) messageErrorVillage.textContent = ''; displayVillageChatHistory();
        });
    }

    if (villageBellMailboxButton && !isAdminViewing) { villageBellMailboxButton.addEventListener('click', openVillageMessageModal); }
    if (closeMessageModalVillageButton && !isAdminViewing) {
        closeMessageModalVillageButton.onclick = () => { if (messageModalVillage) messageModalVillage.style.display = 'none'; updateVillageUnreadCount(); };
    }

    const performVillageSearch = () => { if (!searchVillageInput) return; const searchTerm = searchVillageInput.value; loadVillageFamilyData(searchTerm); };
    if (searchVillageButton) searchVillageButton.addEventListener('click', performVillageSearch);
    if (searchVillageInput) {
        searchVillageInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') performVillageSearch(); });
        searchVillageInput.addEventListener('input', (e) => { if (e.target.value === '') loadVillageFamilyData(); });
    }

    const openEditFamilyModal = (villageNameContext, familyId, familyData) => {
         if (!isAdminViewing && !villageChiefCanEdit) { alert("អ្នកមិនមានសិទ្ធិកែសម្រួលទិន្នន័យនេះទេ។"); return; }
         if (!editFamilyModal || !editFamilyIdInput || !editFamilyVillageInput || !editFamilyHeadNameInput || !editFamilyHeadPhoneAdminInput || !editFamilyMembersContainer || !editFamilyAssetsContainer || !editMemberTemplateAdmin || !editMemberTemplateAdmin.content) { console.error("Dashboard: Essential modal DOM elements or member template content are missing for edit."); alert("មានបញ្ហាក្នុងការបើកទម្រង់កែសម្រួល។"); return;}
         editFamilyIdInput.value = familyId; editFamilyVillageInput.value = villageNameContext;
         editFamilyHeadNameInput.value = familyData.familyName || ""; editFamilyHeadPhoneAdminInput.value = familyData.headOfHouseholdPhone || "";
         editFamilyMembersContainer.innerHTML = '';
         if (familyData.members && Array.isArray(familyData.members)) {
             familyData.members.forEach((memberData, index) => {
                 const memberClone = editMemberTemplateAdmin.content.cloneNode(true); const memberEntryDiv = memberClone.querySelector('.member-entry'); if (!memberEntryDiv) {return; }
                 memberEntryDiv.dataset.originalMemberId = memberData.id || `temp_edit_member_${Date.now()}_${index}`;
                 const originalIdHiddenInput = memberEntryDiv.querySelector('.member-original-id-edit'); if (originalIdHiddenInput) originalIdHiddenInput.value = memberEntryDiv.dataset.originalMemberId;
                 const titleElement = memberEntryDiv.querySelector('h4');
                 if (titleElement) { const memberNameDisplay = memberData.name ? ` (${memberData.name.substring(0,15)}${memberData.name.length > 15 ? '...' : ''})` : ''; titleElement.innerHTML = `សមាជិក${memberNameDisplay} (កែសម្រួល) <button type="button" class="remove-member-edit-button" title="ដកសមាជិកនេះចេញ">×</button>`; const removeBtn = titleElement.querySelector('.remove-member-edit-button'); if (removeBtn) removeBtn.onclick = (e) => { e.preventDefault(); memberEntryDiv.remove(); };}
                 memberFieldDefinitionsForEdit.forEach(def => {
                     const inputEl = memberEntryDiv.querySelector(`.${def.classSuffix}`);
                     if (inputEl) {
                         const valueFromData = memberData[def.prop];
                         if (valueFromData !== undefined && valueFromData !== null) { if (def.type === 'date' && valueFromData) { try { const dateObj = new Date(valueFromData); inputEl.value = !isNaN(dateObj.valueOf()) ? dateObj.toISOString().split('T')[0] : valueFromData;} catch (e) { inputEl.value = valueFromData;}} else { inputEl.value = valueFromData;}}
                         else { inputEl.value = (inputEl.tagName === 'SELECT' && def.options && def.options.length > 0) ? def.options[0].value : '';}
                     }
                 });
                 editFamilyMembersContainer.appendChild(memberClone);
             });
         }
         editFamilyAssetsContainer.innerHTML = '';
         assetFieldDefinitions.forEach(fieldDef => {
             const assetDiv = document.createElement('div'); const label = document.createElement('label'); label.htmlFor = `edit-modal-asset-${fieldDef.id}`; label.textContent = `${fieldDef.label}:`;
             const input = document.createElement('input'); input.type = fieldDef.type; input.id = `edit-modal-asset-${fieldDef.id}`; input.name = fieldDef.id;
             const existingValueString = (familyData.assets && familyData.assets[fieldDef.id] !== undefined && familyData.assets[fieldDef.id] !== null) ? String(familyData.assets[fieldDef.id]) : (fieldDef.type === 'number' ? '0' : (fieldDef.isLandArea ? "" : ""));
             input.value = existingValueString;
             if (fieldDef.type === 'number') input.min = "0"; if (fieldDef.isLandArea && input.type === 'text') { input.placeholder = "0"; if (existingValueString === "0") input.value = "";}
             assetDiv.appendChild(label); assetDiv.appendChild(input); editFamilyAssetsContainer.appendChild(assetDiv);
         });
         if(editFamilyErrorAdmin) editFamilyErrorAdmin.textContent = ''; if(editFamilySuccessAdmin) editFamilySuccessAdmin.textContent = '';
         editFamilyModal.style.display = 'block';
    };

    if(addMemberToEditFormButton && editMemberTemplateAdmin) {
         addMemberToEditFormButton.onclick = () => {
             if (!isAdminViewing && !villageChiefCanEdit) { alert("អ្នកមិនមានសិទ្ធិកែសម្រួល និងបន្ថែមសមាជិកទេ។"); return; }
             if (editFamilyMembersContainer.children.length < MAX_MEMBERS_EDIT_MODAL) {
                 if(!editMemberTemplateAdmin.content) {return;} const memberClone = editMemberTemplateAdmin.content.cloneNode(true);
                 const memberEntryDiv = memberClone.querySelector('.member-entry'); if(!memberEntryDiv) {return;}
                 const newMemberOriginalId = `new_edit_form_${Date.now()}`; memberEntryDiv.dataset.originalMemberId = newMemberOriginalId;
                 const originalIdHiddenInput = memberEntryDiv.querySelector('.member-original-id-edit'); if(originalIdHiddenInput) originalIdHiddenInput.value = newMemberOriginalId;
                 const titleElement = memberEntryDiv.querySelector('h4'); if(titleElement) { titleElement.innerHTML = `សមាជិកថ្មី (កែសម្រួល) <button type="button" class="remove-member-edit-button" title="ដកសមាជិកនេះចេញ">×</button>`; const removeBtn = titleElement.querySelector('.remove-member-edit-button'); if(removeBtn) removeBtn.onclick = (e) => {e.preventDefault(); memberEntryDiv.remove();};}
                 memberEntryDiv.querySelectorAll('input[type="text"], input[type="date"], input[type="tel"], input[type="number"]').forEach(input => input.value = '');
                 memberEntryDiv.querySelectorAll('select').forEach(select => select.selectedIndex = 0); editFamilyMembersContainer.appendChild(memberClone);
             } else { alert(`មិនអាចបន្ថែមសមាជិកលើសពី ${MAX_MEMBERS_EDIT_MODAL} នាក់បានទេ។`); }
         };
    }
    if (closeEditFamilyModalButton && editFamilyModal) { closeEditFamilyModalButton.onclick = () => { editFamilyModal.style.display = 'none'; };}
    
    window.onclick = (event) => {
        if (event.target == editFamilyModal && editFamilyModal) editFamilyModal.style.display = 'none';
        if (event.target == messageModalVillage && messageModalVillage && !isAdminViewing) { messageModalVillage.style.display = 'none'; updateVillageUnreadCount(); }
    };

    if (editFamilyForm) {
        editFamilyForm.addEventListener('submit', (e) => {
             e.preventDefault();
             if (!isAdminViewing && !villageChiefCanEdit) { if(editFamilyErrorAdmin) editFamilyErrorAdmin.textContent = "អ្នកមិនមានសិទ្ធិរក្សាទុកការផ្លាស់ប្តូរទេ។"; return;}
             if(editFamilyErrorAdmin) editFamilyErrorAdmin.textContent = ''; if(editFamilySuccessAdmin) editFamilySuccessAdmin.textContent = '';
             const familyIdToUpdate = editFamilyIdInput.value; const villageOfFamily = editFamilyVillageInput.value;
             const updatedFamilyHeadNameValue = editFamilyHeadNameInput.value.trim(); const updatedHeadPhoneValue = editFamilyHeadPhoneAdminInput ? editFamilyHeadPhoneAdminInput.value.trim() : "";
             if (!updatedFamilyHeadNameValue) { if(editFamilyErrorAdmin) editFamilyErrorAdmin.textContent = "ឈ្មោះមេគ្រួសារមិនអាចនៅទទេបានទេ។"; editFamilyHeadNameInput.focus(); return;}
             const allDataForComparison = getVillageDataStorage();
             const originalFamilyDataForLog = JSON.parse(JSON.stringify( (allDataForComparison[villageOfFamily] || []).find(f => f.familyId === familyIdToUpdate) || null ));
             const updatedFamilyPayload = { familyId: familyIdToUpdate, familyName: updatedFamilyHeadNameValue, headOfHouseholdPhone: updatedHeadPhoneValue, members: [], assets: {}, lastModifiedBy: isAdminViewing ? (currentAdminUsername ? `admin:${currentAdminUsername}` : adminIdForMessaging) : currentVillageIdForMessaging, lastModifiedDate: new Date().toISOString(), entryDate: originalFamilyDataForLog ? originalFamilyDataForLog.entryDate : new Date().toISOString() };
             const memberEditEntries = editFamilyMembersContainer.querySelectorAll('.member-entry'); let editFormValidationError = false;
             for (const entry of memberEditEntries) {
                 const nameInput = entry.querySelector('.member-name-edit'); const name = nameInput ? nameInput.value.trim() : '';
                 const nationalIdInput = entry.querySelector('.member-nationalId-edit'); const electionOfficeIdInput = entry.querySelector('.member-electionOfficeId-edit');
                 if (name) {
                     const nationalIdValue = nationalIdInput ? nationalIdInput.value.trim() : '';
                     if (nationalIdValue !== "" && nationalIdValue.length !== 9) { if(editFamilyErrorAdmin) editFamilyErrorAdmin.textContent = `សមាជិក "${name}"៖ លេខអត្តសញ្ញាណប័ណ្ណត្រូវតែមាន 9 ខ្ទង់។`; nationalIdInput.focus(); editFormValidationError = true; break;}
                     const electionOfficeIdValue = electionOfficeIdInput ? electionOfficeIdInput.value.trim() : '';
                     if (electionOfficeIdValue !== "" && electionOfficeIdValue.length !== 4) { if(editFamilyErrorAdmin) editFamilyErrorAdmin.textContent = `សមាជិក "${name}"៖ លេខការិយាល័យបោះឆ្នោតត្រូវតែមាន 4 ខ្ទង់។`; electionOfficeIdInput.focus(); editFormValidationError = true; break;}
                     const memberObj = {}; let originalId = entry.dataset.originalMemberId;
                     const hiddenIdInput = entry.querySelector('.member-original-id-edit'); if (hiddenIdInput && hiddenIdInput.value) originalId = hiddenIdInput.value;
                     memberObj.id = originalId || `mem_edited_${Date.now()}_${Math.random().toString(36).substr(2,3)}`;
                     if (memberObj.id.startsWith('new_edit_form_') || memberObj.id.startsWith('temp_edit_member_')) { memberObj.id = `mem_${Date.now()}_${Math.random().toString(36).substr(2,5)}`;}
                     memberFieldDefinitionsForEdit.forEach(def => { const inputEl = entry.querySelector(`.${def.classSuffix}`); if (inputEl) { memberObj[def.prop] = (inputEl.value || "").trim(); if (def.type === 'select' && !memberObj[def.prop] && def.options && def.options.length > 0) { memberObj[def.prop] = def.options[0].value;}}});
                     updatedFamilyPayload.members.push(memberObj);
                 }
             }
             if(editFormValidationError) return;
            const assetEditInputs = editFamilyAssetsContainer.querySelectorAll('input[name]');
            assetEditInputs.forEach(input => {
                const assetKey = input.name; const assetDef = assetFieldDefinitions.find(def => def.id === assetKey);
                if (assetKey) { let value; if (assetDef?.isLandArea) { value = input.value.trim() || "0"; } else if (input.type === 'number') { value = parseInt(input.value, 10) || 0; } else { value = input.value.trim(); } updatedFamilyPayload.assets[assetKey] = value;}
            });
            if (originalFamilyDataForLog && originalFamilyDataForLog.enteredBy && !updatedFamilyPayload.enteredBy){ updatedFamilyPayload.enteredBy = originalFamilyDataForLog.enteredBy; }
             const allDataToSave = getVillageDataStorage();
             if (allDataToSave.hasOwnProperty(villageOfFamily) && Array.isArray(allDataToSave[villageOfFamily])) {
                 const familyIndex = allDataToSave[villageOfFamily].findIndex(f => f.familyId === familyIdToUpdate);
                 if (familyIndex > -1) {
                     updatedFamilyPayload.entryDate = allDataToSave[villageOfFamily][familyIndex].entryDate;
                     if (!updatedFamilyPayload.enteredBy && allDataToSave[villageOfFamily][familyIndex].enteredBy) { updatedFamilyPayload.enteredBy = allDataToSave[villageOfFamily][familyIndex].enteredBy;}
                     allDataToSave[villageOfFamily][familyIndex] = updatedFamilyPayload; saveVillageDataStorage(allDataToSave);
                     if (originalFamilyDataForLog) {
                        addActivityLogEntry("EDITED_FAMILY", villageOfFamily, familyIdToUpdate, updatedFamilyPayload.familyName, originalFamilyDataForLog, updatedFamilyPayload, isAdminViewing);
                     }
                     if(editFamilySuccessAdmin) editFamilySuccessAdmin.textContent = 'ទិន្នន័យគ្រួសារបានកែសម្រួលជោគជ័យ!';
                     loadVillageFamilyData(searchVillageInput ? searchVillageInput.value : '');
                     setTimeout(() => { if(editFamilyModal) editFamilyModal.style.display = 'none'; if(editFamilySuccessAdmin) editFamilySuccessAdmin.textContent = '';}, 2000);
                 } else { if(editFamilyErrorAdmin) editFamilyErrorAdmin.textContent = `រកមិនឃើញទិន្នន័យគ្រួសារដើម ID ${familyIdToUpdate}។`;}
             } else { if(editFamilyErrorAdmin) editFamilyErrorAdmin.textContent = `មិនមានទិន្នន័យសម្រាប់ភូមិ ${villageOfFamily}។`;}
         });
    }

    const deleteFamilyData = (villageNameContext, familyIdToDelete, familyNameToConfirmForDialog = '') => {
         if (!isAdminViewing && !villageChiefCanEdit) { alert("អ្នកមិនមានសិទ្ធិលុបទិន្នន័យនេះទេ។"); return; }
         const familyNameForConfirm = familyNameToConfirmForDialog || `ID ${familyIdToDelete}`;
         if (!confirm(`តើអ្នកពិតជាចង់លុបទិន្នន័យគ្រួសារ "${familyNameForConfirm}" ក្នុងភូមិ "${villageNameContext}" មែនទេ?`)) return;
         const allVillageData = getVillageDataStorage();
         if (allVillageData.hasOwnProperty(villageNameContext) && Array.isArray(allVillageData[villageNameContext])) {
             const familyToDeleteData = JSON.parse(JSON.stringify(allVillageData[villageNameContext].find(f => f.familyId === familyIdToDelete) || null));
             const initialLength = allVillageData[villageNameContext].length;
             allVillageData[villageNameContext] = allVillageData[villageNameContext].filter(family => family.familyId !== familyIdToDelete);
             if (allVillageData[villageNameContext].length < initialLength) {
                 saveVillageDataStorage(allVillageData);
                 if (familyToDeleteData) {
                    addActivityLogEntry("DELETED_FAMILY", villageNameContext, familyIdToDelete, familyToDeleteData.familyName, familyToDeleteData, null, isAdminViewing);
                 }
                 loadVillageFamilyData(searchVillageInput ? searchVillageInput.value : '');
                 alert(`ទិន្នន័យគ្រួសារ "${familyNameForConfirm}" ត្រូវបានលុប។`);
             } else { alert('រកមិនឃើញទិន្នន័យគ្រួសារដែលត្រូវលុប។');}
         } else { alert(`មានបញ្ហាក្នុងការទាញយកទិន្នន័យភូមិ "${villageNameContext}"។`);}
    };

    if (backToAdminButton) { backToAdminButton.addEventListener('click', () => { sessionStorage.removeItem('adminViewingVillage'); window.location.href = 'admin_dashboard.html';});}
    if (logoutButton) { logoutButton.addEventListener('click', () => { sessionStorage.clear(); window.location.href = 'index.html';});}

    loadVillageFamilyData();
    if (!isAdminViewing) {
        updateVillageUnreadCount();
    }
});
