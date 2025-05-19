// admin_script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Early check and DOM References ---
    const userType = sessionStorage.getItem('loggedInUserType');
    const adminUsernameFromSession = sessionStorage.getItem('loggedInUsername');

    if (userType !== 'admin' || !adminUsernameFromSession) {
        alert('សូមចូលប្រើជា Admin ជាមុនសិន!');
        sessionStorage.clear(); window.location.href = 'index.html'; return;
    }

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
    const ageGroup18_35_AdminSpan = document.getElementById('age-group-18-35-admin');
    const ageGroup36_55_AdminSpan = document.getElementById('age-group-36-55-admin');
    const ageGroup56_65_AdminSpan = document.getElementById('age-group-56-65-admin');
    const ageGroup66Plus_AdminSpan = document.getElementById('age-group-66-plus-admin');
    // New DOM references for female counts in age groups for Admin
    const ageGroup18_35_Female_AdminSpan = document.getElementById('age-group-18-35-female-admin');
    const ageGroup36_55_Female_AdminSpan = document.getElementById('age-group-36-55-female-admin');
    const ageGroup56_65_Female_AdminSpan = document.getElementById('age-group-56-65-female-admin');
    const ageGroup66Plus_Female_AdminSpan = document.getElementById('age-group-66-plus-female-admin');

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

    const MAX_MEMBERS_EDIT = 9;
    const { jsPDF } = window.jspdf;

    // --- Font Embedding for Khmer OS Battambang ---
    const khmerOSBattambangBase64 = 'YOUR_KHMER_OS_BATTAMBANG_BASE64_STRING_HERE'; // <- **PASTE YOUR BASE64 STRING HERE**
    const FONT_FILENAME_VFS = "KhmerOSBattambang-Regular.ttf"; // Make sure this matches the font you encoded
    const FONT_NAME_JSPDF = "KhmerOSBattambang"; // The name you'll use with doc.setFont()
    let khmerFontForAdminPDFLoaded = false;

    async function loadKhmerFont(doc) {
        if (khmerFontForAdminPDFLoaded && doc.getFont().fontName.toLowerCase() === FONT_NAME_JSPDF.toLowerCase()) {
            doc.setFont(FONT_NAME_JSPDF); // Re-set if on a new page or new doc instance
            return;
        }
        try {
            const isValidBase64 = khmerOSBattambangBase64 &&
                                  khmerOSBattambangBase64 !== 'YOUR_KHMER_OS_BATTAMBANG_BASE64_STRING_HERE' &&
                                  khmerOSBattambangBase64.length > 1000;
            if (isValidBase64) {
                if (!doc.getFileFromVFS(FONT_FILENAME_VFS)) {
                    doc.addFileToVFS(FONT_FILENAME_VFS, khmerOSBattambangBase64);
                }
                const fontList = doc.getFontList();
                if (!fontList[FONT_NAME_JSPDF]) {
                    doc.addFont(FONT_FILENAME_VFS, FONT_NAME_JSPDF, "normal", "UTF-8");
                }
                doc.setFont(FONT_NAME_JSPDF);
                khmerFontForAdminPDFLoaded = true; // Set flag for this session after first successful load
            } else {
                console.warn("Admin PDF: Khmer OS Battambang font Base64 string is missing, placeholder, or too short. PDF text might not render Khmer correctly. Falling back to helvetica.");
                doc.setFont("helvetica", "normal");
                khmerFontForAdminPDFLoaded = false;
            }
        } catch (e) {
            console.error("Admin PDF: Error loading/setting Khmer font:", e);
            doc.setFont("helvetica", "normal");
            khmerFontForAdminPDFLoaded = false;
        }
    }

    // --- Welcome Message & Time Display ---
    if (welcomeMessage) {
        welcomeMessage.textContent = `សូមស្វាគមន៍, ${adminUsernameFromSession}! (Admin)`;
    }
    const displayCurrentDateTimeForAdmin = () => {
        if (!adminCurrentDateTimeDisplay) return;
        const now = new Date();
        const daysKhmer = ["អាទិត្យ", "ច័ន្ទ", "អង្គារ", "ពុធ", "ព្រហស្បត្តិ៍", "សុក្រ", "សៅរ៍"];
        const monthsKhmer = ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"];
        const dayName = daysKhmer[now.getDay()];
        const dayOfMonth = now.getDate();
        const monthName = monthsKhmer[now.getMonth()];
        const year = now.getFullYear();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'ល្ងាច' : 'ព្រឹក';
        hours = hours % 12; hours = hours ? hours : 12;
        const hoursStr = hours.toString();
        const timeString = `ម៉ោង ${hoursStr}:<span style="color:rgb(3, 20, 250);">${minutes}</span>:<span style="color:rgb(253, 8, 8);">${seconds}</span> ${ampm}`;
        adminCurrentDateTimeDisplay.innerHTML = `ថ្ងៃ${dayName} ទី${dayOfMonth} ខែ${monthName} ឆ្នាំ${year} ${timeString}`;
    };
    if (typeof displayCurrentDateTimeForAdmin === 'function') {
        displayCurrentDateTimeForAdmin();
        setInterval(displayCurrentDateTimeForAdmin, 1000);
    }

    // --- LocalStorage & Field Definitions ---
    const VILLAGES_KEY = 'registeredVillages_v2';
    const VILLAGE_DATA_KEY = 'villageData_v2';
    const ACTIVITY_LOG_KEY = 'activityLog_v2';

    const getRegisteredVillages = () => JSON.parse(localStorage.getItem(VILLAGES_KEY) || '{}');
    const getVillageDataStorage = () => JSON.parse(localStorage.getItem(VILLAGE_DATA_KEY) || '{}');
    const saveVillageDataStorage = (data) => localStorage.setItem(VILLAGE_DATA_KEY, JSON.stringify(data));
    const saveRegisteredVillages = (villages) => localStorage.setItem(VILLAGES_KEY, JSON.stringify(villages));

    const assetFieldDefinitions = [
        {id: 'largeTrucks', label: 'រថយន្ដធំ', type: 'number'}, {id: 'smallCars', label: 'រថយន្តតូច', type: 'number'},
        {id: 'modifiedVehicles', label: 'រថយន្ដកែឆ្នៃ', type: 'number'}, {id: 'tractors', label: 'ត្រាក់ទ័រ', type: 'number'},
        {id: 'kubotas', label: 'គោយន្ដ', type: 'number'}, {id: 'riceHarvesters', label: 'ម៉ាស៊ីនច្រូតស្រូវ', type: 'number'},
        {id: 'riceMills', label: 'ម៉ាស៊ីនកិនស្រូវ', type: 'number'}, {id: 'waterPumpsWells', label: 'អណ្ដូងស្នប់', type: 'number'},
        {id: 'ponds', label: 'ស្រះទឹក', type: 'number'},
        {id: 'residentialLandSize', label: 'ទំហំដីលំនៅដ្ឋាន', type: 'text', isLandArea: true},
        {id: 'paddyLandSize', label: 'ទំហំដីស្រែ', type: 'text', isLandArea: true},
        {id: 'plantationLandSize', label: 'ដីចំការ (ផ្សេងៗ)', type: 'text', isLandArea: true},
        {id: 'coconutLandSize', label: 'ដីចំការដូង', type: 'text', isLandArea: true},
        {id: 'mangoLandSize', label: 'ដីចំការស្វាយ', type: 'text', isLandArea: true},
        {id: 'cashewLandSize', label: 'ដីចំការស្វាយចន្ទី', type: 'text', isLandArea: true},
        {id: 'livestockLandSize', label: 'ដីចិញ្ចឹមសត្វ', type: 'text', isLandArea: true},
        {id: 'vehicleRepairShops', label: 'ជាងជួសជុល', type: 'number'}, {id: 'groceryStores', label: 'លក់ចាប់ហួយ', type: 'number'},
        {id: 'mobilePhoneShops', label: 'លក់ទូរស័ព្ទ', type: 'number'}, {id: 'constructionMaterialDepots', label: 'លក់គ្រឿងសំណង់', type: 'number'},
        {id: 'fuelDepots', label: 'ដេប៉ូប្រេង', type: 'number'}, {id: 'beautySalons', label: 'សម្អាងការ', type: 'number'},
        {id: 'motorcycles', label: 'ម៉ូតូ', type: 'number'}, {id: 'tukTuks', label: 'ម៉ូតូកង់បី', type: 'number'},
        {id: 'remorques', label: 'ម៉ូតូសណ្ដោងរម៉ក', type: 'number'}
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

    // --- Utility Functions ---
    const calculateAge = (dobString) => {
        if (!dobString) return null;
        const birthDate = new Date(dobString);
        if (isNaN(birthDate.valueOf())) return null;
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };
    const parseLandSize = (textValue) => {
        if (!textValue || typeof textValue !== 'string') return null;
        const cleanedValue = textValue.trim().toLowerCase();
        const numberMatch = cleanedValue.match(/(\d+(\.\d+)?)/);
        if (!numberMatch) return null;
        const value = parseFloat(numberMatch[0]);
        let unit = 'unknown';
        if (cleanedValue.includes('ហិចតា') || cleanedValue.includes('ហិកតា') || cleanedValue.includes('ha')) unit = 'hectare';
        else if (cleanedValue.includes('ម៉ែត្រការ៉េ') || cleanedValue.includes('m2')) unit = 'sqm';
        else if (cleanedValue.includes('អា') || cleanedValue.endsWith('a')) unit = 'are';
        else if (cleanedValue.match(/^(\d+(\.\d+)?)$/)) unit = 'hectare';
        return { value, unit };
    };
    const convertToHectares = (value, unit) => {
        if (isNaN(value)) return 0;
        switch (unit) {
            case 'hectare': return value;
            case 'sqm': return value / 10000;
            case 'are': return value / 100;
            case 'unknown': return value;
            default: return 0;
        }
    };

    // --- Admin Dashboard Specific Functions ---
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
            const permissionCell = row.insertCell();
            permissionCell.style.textAlign = 'center';
            const permissionButton = document.createElement('button');
            permissionButton.classList.add('permission-toggle-button');
            permissionButton.dataset.villageName = name;
            permissionButton.textContent = villageInfo.canEditData ? 'បិទសិទ្ធិកែ' : 'បើកសិទ្ធិកែ';
            permissionButton.style.backgroundColor = villageInfo.canEditData ? '#28a745' : '#dc3545';
            permissionButton.onclick = () => toggleVillageEditPermission(name);
            permissionCell.appendChild(permissionButton);
            const actionCell = row.insertCell();
            const viewButton = document.createElement('button');
            viewButton.textContent = 'មើល Dashboard ភូមិ';
            viewButton.onclick = () => { sessionStorage.setItem('adminViewingVillage', name); window.location.href = 'dashboard.html'; };
            actionCell.appendChild(viewButton);
            const option = document.createElement('option');
            option.value = name; option.textContent = name;
            villageSelect.appendChild(option);
        });
    };

    const toggleVillageEditPermission = (villageName) => {
        const registeredVillages = getRegisteredVillages();
        if (registeredVillages[villageName]) {
            registeredVillages[villageName].canEditData = !registeredVillages[villageName].canEditData;
            saveRegisteredVillages(registeredVillages);
            loadRegisteredVillagesList();
            alert(`សិទ្ធិកែសម្រួលសម្រាប់មេភូមិ "${villageName}" ត្រូវបាន ${registeredVillages[villageName].canEditData ? 'បើក' : 'បិទ'}។`);
        }
    };

    const printSingleFamilyDataToPDF = async (familyData, villageName) => {
        if (!familyData) {
            alert("មិនមានទិន្នន័យគ្រួសារសម្រាប់បោះពុម្ពទេ។");
            return;
        }
        khmerFontForAdminPDFLoaded = false; // Reset for each new PDF generation

        const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
        await loadKhmerFont(doc);

        let yPosition = 20;
        const lineHeight = 8;
        const indent = 15;
        const pageWidth = doc.internal.pageSize.getWidth();
        const contentWidth = pageWidth - (indent * 2);

        doc.setFontSize(16);
        doc.text(`ទិន្នន័យគ្រួសារ: ${familyData.familyName || 'N/A'}`, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += lineHeight * 1.5;

        doc.setFontSize(11);
        doc.text(`ភូមិ: ${villageName || 'N/A'}`, indent, yPosition); yPosition += lineHeight;
        try {
            doc.text(`កាលបរិច្ឆេទបញ្ចូល: ${new Date(familyData.entryDate).toLocaleDateString('km-KH', { day: '2-digit', month: 'long', year: 'numeric' })}`, indent, yPosition);
        } catch { doc.text(`កាលបរិច្ឆេទបញ្ចូល: មិនត្រឹមត្រូវ`, indent, yPosition); }
        yPosition += lineHeight;
        if (familyData.headOfHouseholdPhone) {
            doc.text(`លេខទូរស័ព្ទមេគ្រួសារ: ${familyData.headOfHouseholdPhone}`, indent, yPosition); yPosition += lineHeight;
        }
        yPosition += lineHeight * 0.5;

        doc.setFontSize(13);
        doc.text("សមាជិកគ្រួសារ:", indent, yPosition); yPosition += lineHeight * 1.2;
        doc.setFontSize(10);

        if (familyData.members && familyData.members.length > 0) {
            for (const [index, member] of familyData.members.entries()) {
                if (yPosition > doc.internal.pageSize.getHeight() - 30) {
                    doc.addPage(); yPosition = 20;
                    await loadKhmerFont(doc);
                    doc.setFontSize(13); doc.text("សមាជិកគ្រួសារ (ត):", indent, yPosition); yPosition += lineHeight * 1.2;
                    doc.setFontSize(10);
                }
                doc.text(`${index + 1}. ឈ្មោះ: ${member.name || 'N/A'}`, indent + 5, yPosition); yPosition += lineHeight;
                doc.text(`   ភេទ: ${member.gender || 'N/A'}`, indent + 8, yPosition); yPosition += lineHeight;
                doc.text(`   ថ្ងៃខែឆ្នាំកំណើត: ${member.dob ? new Date(member.dob).toLocaleDateString('km-KH', {day:'2-digit', month:'2-digit', year:'numeric'}) : 'N/A'}`, indent + 8, yPosition); yPosition += lineHeight;
                if(member.birthProvince) { doc.text(`   ខេត្តកំណើត: ${member.birthProvince}`, indent + 8, yPosition); yPosition += lineHeight; }
                if(member.educationLevel) { doc.text(`   កម្រិតវប្បធម៌: ${member.educationLevel}`, indent + 8, yPosition); yPosition += lineHeight; }
                if(member.occupation) { doc.text(`   មុខរបរ: ${member.occupation}`, indent + 8, yPosition); yPosition += lineHeight; }
                if(member.nationalId) { doc.text(`   អត្តសញ្ញាណប័ណ្ណ: ${member.nationalId}`, indent + 8, yPosition); yPosition += lineHeight; }
                if(member.electionOfficeId) { doc.text(`   ការិយាល័យបោះឆ្នោត: ${member.electionOfficeId}`, indent + 8, yPosition); yPosition += lineHeight; }
                if(member.internalMigration && member.internalMigration !== 'ទេ') { doc.text(`   ចំណាកស្រុកក្នុង: ${member.internalMigration}`, indent + 8, yPosition); yPosition += lineHeight; }
                if(member.externalMigration && member.externalMigration !== 'ទេ') { doc.text(`   ចំណាកស្រុកក្រៅ: ${member.externalMigration}`, indent + 8, yPosition); yPosition += lineHeight; }
                yPosition += lineHeight * 0.3;
            }
        } else {
            doc.text("មិនមានសមាជិកគ្រួសារ។", indent + 5, yPosition); yPosition += lineHeight;
        }
        yPosition += lineHeight;

        doc.setFontSize(13);
        doc.text("ទ្រព្យសម្បត្តិ និងអាជីវកម្ម:", indent, yPosition); yPosition += lineHeight * 1.2;
        doc.setFontSize(10);
        let hasAssets = false;
        if (familyData.assets && typeof familyData.assets === 'object' && Object.keys(familyData.assets).length > 0) {
            for (const def of assetFieldDefinitions) {
                const assetValue = familyData.assets[def.id];
                if (assetValue !== undefined && assetValue !== null && String(assetValue).trim() !== "" && String(assetValue).trim() !== "0") {
                    if (yPosition > doc.internal.pageSize.getHeight() - 20) {
                        doc.addPage(); yPosition = 20;
                        await loadKhmerFont(doc);
                        doc.setFontSize(13); doc.text("ទ្រព្យសម្បត្តិ និងអាជីវកម្ម (ត):", indent, yPosition); yPosition += lineHeight * 1.2;
                        doc.setFontSize(10);
                    }
                    const textToPrint = `${def.label}: ${assetValue}`;
                    const textLines = doc.splitTextToSize(textToPrint, contentWidth - 8);
                    doc.text(textLines, indent + 5, yPosition);
                    yPosition += lineHeight * textLines.length;
                    hasAssets = true;
                }
            }
        }
        if (!hasAssets) {
            if (yPosition > doc.internal.pageSize.getHeight() - 20) {
                doc.addPage(); yPosition = 20;
                await loadKhmerFont(doc); doc.setFontSize(10);
            }
            doc.text("មិនមានទ្រព្យសម្បត្តិ/អាជីវកម្ម។", indent + 5, yPosition); yPosition += lineHeight;
        }

        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            await loadKhmerFont(doc);
            doc.setFontSize(9);
            doc.text(`ទំព័រ ${i} នៃ ${pageCount}`, pageWidth - indent, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
            doc.text(`បោះពុម្ពថ្ងៃទី: ${new Date().toLocaleDateString('km-KH', {day:'2-digit', month:'long', year:'numeric'})}`, indent, doc.internal.pageSize.getHeight() - 10);
        }

        doc.save(`ទិន្នន័យគ្រួសារ-${familyData.familyName || familyData.familyId}.pdf`);
        alert("ការបង្កើត PDF បានបញ្ចប់។ សូមពិនិត្យមើលឯកសារដែលបានទាញយក។");
    };

    const renderFamilyCardForAdmin = (familyData, containerElement, villageContextName) => {
         if (!familyCardTemplate || !familyCardTemplate.content) {console.error("Admin: Family card template or content missing"); return;}
         const cardClone = familyCardTemplate.content.cloneNode(true);
         const familyCard = cardClone.querySelector('.family-card');
         if (!familyCard) {console.error("Admin: '.family-card' missing in template"); return;}

         familyCard.dataset.familyId = familyData.familyId;
         familyCard.dataset.village = villageContextName;
         familyCard.querySelector('.family-card-name').textContent = `${familyData.familyName || 'N/A'} (ភូមិ ${villageContextName})`;
         try {
            familyCard.querySelector('.family-card-entry-date').textContent = `កាលបរិច្ឆេទបញ្ចូល: ${new Date(familyData.entryDate).toLocaleDateString('km-KH', { day: '2-digit', month: 'short', year: 'numeric' })}`;
         } catch { familyCard.querySelector('.family-card-entry-date').textContent = `កាលបរិច្ឆេទបញ្ចូល: មិនត្រឹមត្រូវ`; }

         const membersTableBody = familyCard.querySelector('.members-table tbody');
         let familyMemberCount = 0;
         if (familyData.members && Array.isArray(familyData.members)) {
             familyMemberCount = familyData.members.length;
             membersTableBody.innerHTML = '';
             if (familyMemberCount > 0) {
                familyData.members.forEach(member => {
                    const row = membersTableBody.insertRow();
                    row.insertCell().textContent = member.name || 'N/A';
                    row.insertCell().textContent = member.gender || 'N/A';
                    row.insertCell().textContent = member.dob ? new Date(member.dob).toLocaleDateString('km-KH', {day:'2-digit',month:'2-digit',year:'numeric'}) : 'N/A';
                    row.insertCell().textContent = member.birthProvince || 'N/A';
                    row.insertCell().textContent = member.educationLevel || 'N/A';
                    row.insertCell().textContent = member.occupation || 'N/A';
                    row.insertCell().textContent = member.nationalId || 'N/A';
                    row.insertCell().textContent = member.electionOfficeId || 'N/A';
                    row.insertCell().textContent = member.internalMigration || 'N/A';
                    row.insertCell().textContent = member.externalMigration || 'N/A';
                });
             } else {
                membersTableBody.innerHTML = '<tr><td colspan="10" style="text-align:center;">មិនមានសមាជិកគ្រួសារ។</td></tr>';
             }
         } else if (membersTableBody) {
            membersTableBody.innerHTML = '<tr><td colspan="10" style="text-align:center;">មិនមានព័ត៌មានសមាជិក។</td></tr>';
         }
         const memberCountEl = familyCard.querySelector('.family-member-count');
         if(memberCountEl) memberCountEl.textContent = familyMemberCount;

         const assetsDiv = familyCard.querySelector('.assets-details');
         if (assetsDiv) {
             assetsDiv.innerHTML = '';
             let hasAssets = false;
             if (familyData.assets && typeof familyData.assets === 'object') {
                 assetFieldDefinitions.forEach(def => {
                    const assetValue = familyData.assets[def.id];
                    if (assetValue !== undefined && assetValue !== null && String(assetValue).trim() !== "" && String(assetValue).trim() !== "0") {
                         const p = document.createElement('p');
                         p.innerHTML = `<strong>${def.label}:</strong> ${assetValue}`;
                         assetsDiv.appendChild(p);
                         hasAssets = true;
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
             else console.warn("Admin: '.edit-family-button' not found.");
             if (deleteBtn) deleteBtn.onclick = () => deleteFamilyDataForAdmin(villageContextName, familyData.familyId, familyData.familyName);
             else console.warn("Admin: '.delete-family-button' not found.");
             if (printBtn) {
                 printBtn.onclick = () => printSingleFamilyDataToPDF(familyData, villageContextName);
             } else {
                 console.warn("Admin: '.print-family-button' not found in family card template.");
             }
         } else {
            console.warn("Admin: '.family-card-actions' not found.");
         }
         containerElement.appendChild(cardClone);
    };

    const loadFamilyDataForSelectedVillageAdmin = (villageName, searchTerm = '') => {
         if (!familyListContainerAdmin || !selectedVillageNameH3 || !noFamilyDataMessageAdmin) {
            console.warn("Admin: Family display/message elements are missing.");
            return;
         }
         familyListContainerAdmin.innerHTML = '';
         noFamilyDataMessageAdmin.style.display = 'none';

         if (!villageName && !searchTerm) {
            selectedVillageNameH3.textContent = 'ទិន្នន័យគ្រួសារ: [មិនបានជ្រើសរើសភូមិ]';
            noFamilyDataMessageAdmin.textContent = 'សូមជ្រើសរើសភូមិដើម្បីបង្ហាញទិន្នន័យ ឬធ្វើការស្វែងរក។';
            noFamilyDataMessageAdmin.style.display = 'block';
            return;
         }
         const allVillageData = getVillageDataStorage();
         let familiesToDisplay = [];
         if (villageName && !searchTerm) {
            selectedVillageNameH3.textContent = `ទិន្នន័យគ្រួសារសម្រាប់ភូមិ: ${villageName}`;
            familiesToDisplay = (allVillageData[villageName] && Array.isArray(allVillageData[villageName])) ? [...allVillageData[villageName]] : [];
         } else if (villageName && searchTerm) {
            selectedVillageNameH3.textContent = `លទ្ធផលស្វែងរកក្នុងភូមិ ${villageName} សម្រាប់: "${searchTerm}"`;
            const familiesInSelectedVillage = (allVillageData[villageName] && Array.isArray(allVillageData[villageName])) ? allVillageData[villageName] : [];
            const searchTermLower = searchTerm.toLowerCase();
            familiesToDisplay = familiesInSelectedVillage.filter(family =>
                (family.familyName && family.familyName.toLowerCase().includes(searchTermLower)) ||
                (family.members && family.members.some(mem =>
                    (mem.name && mem.name.toLowerCase().includes(searchTermLower)) ||
                    (mem.nationalId && mem.nationalId.includes(searchTermLower))
                ))
            );
         } else if (!villageName && searchTerm) {
            selectedVillageNameH3.textContent = `លទ្ធផលស្វែងរកសកលសម្រាប់: "${searchTerm}"`;
            const searchTermLower = searchTerm.toLowerCase();
            for (const vName in allVillageData) {
                if (allVillageData.hasOwnProperty(vName) && Array.isArray(allVillageData[vName])) {
                    allVillageData[vName].forEach(family => {
                        if ((family.familyName && family.familyName.toLowerCase().includes(searchTermLower)) ||
                            (family.members && family.members.some(mem =>
                                (mem.name && mem.name.toLowerCase().includes(searchTermLower)) ||
                                (mem.nationalId && mem.nationalId.includes(searchTermLower))
                            ))) {
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
             noFamilyDataMessageAdmin.textContent = searchTerm
                ? `រកមិនឃើញលទ្ធផលសម្រាប់ "${searchFamilyInput ? searchFamilyInput.value : searchTerm}"${villageName ? ` នៅក្នុងភូមិ ${villageName}` : ' ទូទាំងប្រព័ន្ធ'}។`
                : (villageName ? `មិនមានទិន្នន័យគ្រួសារសម្រាប់ភូមិ ${villageName} ទេ។` : 'សូមធ្វើការស្វែងរក។');
             noFamilyDataMessageAdmin.style.display = 'block';
         }
    };

    const displayGlobalAssetSummary = (allVillageData) => {
        if (!adminAssetSummaryTbody) return;
        const assetTotals = {};
        assetFieldDefinitions.forEach(def => { if (def.type === 'number' || def.isLandArea) assetTotals[def.id] = 0; });
        for (const villageNameKey in allVillageData) {
            if (allVillageData.hasOwnProperty(villageNameKey) && Array.isArray(allVillageData[villageNameKey])) {
                allVillageData[villageNameKey].forEach(family => {
                    if (family.assets && typeof family.assets === 'object') {
                        assetFieldDefinitions.forEach(def => {
                            const assetKey = def.id; const assetValue = family.assets[assetKey];
                            if (assetValue !== undefined && assetTotals.hasOwnProperty(assetKey)) {
                                if (def.isLandArea) {
                                    const parsed = parseLandSize(String(assetValue));
                                    if (parsed) assetTotals[assetKey] += convertToHectares(parsed.value, parsed.unit);
                                } else if (def.type === 'number') {
                                    const value = parseInt(assetValue, 10);
                                    if (!isNaN(value)) assetTotals[assetKey] += value;
                                }
                            }
                        });
                    }
                });
            }
        }
        adminAssetSummaryTbody.innerHTML = '';
        let hasAnyGlobalAssets = false;
        assetFieldDefinitions.forEach(def => {
            const row = adminAssetSummaryTbody.insertRow();
            row.insertCell().textContent = def.label;
            const totalCell = row.insertCell();
            if (assetTotals.hasOwnProperty(def.id)) {
                const totalValue = assetTotals[def.id];
                if (totalValue > 0 || (def.isLandArea && totalValue !== undefined && totalValue !== null && totalValue !== 0 )) hasAnyGlobalAssets = true;
                if (def.isLandArea) {
                    const formattedHectares = parseFloat(totalValue.toFixed(4));
                    totalCell.textContent = `${formattedHectares} ហិចតា`;
                } else { totalCell.textContent = totalValue; }
            } else {
                totalCell.textContent = def.isLandArea ? '0 ហិចតា' : (def.type === 'number' ? '0' : '-');
            }
        });
         if (!hasAnyGlobalAssets && Object.keys(allVillageData).length > 0 && Object.values(allVillageData).some(vf => vf.length > 0)) {
            adminAssetSummaryTbody.innerHTML = '<tr><td colspan="2"><em>មិនមានទិន្នន័យទ្រព្យសម្បត្តិសរុប។</em></td></tr>';
         } else if (Object.keys(allVillageData).length === 0 || !Object.values(allVillageData).some(vf => vf.length > 0)) {
            adminAssetSummaryTbody.innerHTML = '<tr><td colspan="2"><em>មិនមានទិន្នន័យដើម្បីគណនា។</em></td></tr>';
         }
    };

    const calculateAdminSummary = () => {
        if (!totalVillagesAdminSpan || !totalFamiliesAdminSpan || !totalPeopleAdminSpan || !totalFemalesAdminSpan ||
            !totalInternalMigrantsAdminSpan || !totalExternalMigrantsAdminSpan ||
            !ageGroup18_35_AdminSpan || !ageGroup36_55_AdminSpan || !ageGroup56_65_AdminSpan || !ageGroup66Plus_AdminSpan ||
            !ageGroup18_35_Female_AdminSpan || !ageGroup36_55_Female_AdminSpan || !ageGroup56_65_Female_AdminSpan || !ageGroup66Plus_Female_AdminSpan
        ) {
            console.warn("Admin Dashboard: One or more summary span elements are missing from the DOM.");
            return;
        }

        const allVillageData = getVillageDataStorage();
        let totalFamiliesAll = 0, totalPeopleAll = 0, totalFemalesAll = 0;
        let totalInternalMigrantsAll = 0, totalExternalMigrantsAll = 0;
        let villageCount = Object.keys(getRegisteredVillages()).length;
        let count18_35_All = 0, count36_55_All = 0, count56_65_All = 0, count66Plus_All = 0;
        let count18_35_Female_All = 0, count36_55_Female_All = 0, count56_65_Female_All = 0, count66Plus_Female_All = 0;

        for (const villageNameKey in allVillageData) {
            if (allVillageData.hasOwnProperty(villageNameKey) && Array.isArray(allVillageData[villageNameKey])) {
                const familiesInThisVillage = allVillageData[villageNameKey];
                totalFamiliesAll += familiesInThisVillage.length;
                familiesInThisVillage.forEach(family => {
                    if (family.members && Array.isArray(family.members)) {
                        totalPeopleAll += family.members.length;
                        family.members.forEach(member => {
                            if (member.gender === 'ស្រី') totalFemalesAll++;
                            if (member.internalMigration === 'បាទ') totalInternalMigrantsAll++;
                            if (member.externalMigration === 'បាទ') totalExternalMigrantsAll++;
                            const age = calculateAge(member.dob);
                            if (age !== null) {
                                if (age >= 18 && age <= 35) {
                                    count18_35_All++;
                                    if (member.gender === 'ស្រី') count18_35_Female_All++;
                                } else if (age >= 36 && age <= 55) {
                                    count36_55_All++;
                                    if (member.gender === 'ស្រី') count36_55_Female_All++;
                                } else if (age >= 56 && age <= 65) {
                                    count56_65_All++;
                                    if (member.gender === 'ស្រី') count56_65_Female_All++;
                                } else if (age >= 66) {
                                    count66Plus_All++;
                                    if (member.gender === 'ស្រី') count66Plus_Female_All++;
                                }
                            }
                        });
                    }
                });
            }
        }
        totalVillagesAdminSpan.textContent = villageCount;
        totalFamiliesAdminSpan.textContent = totalFamiliesAll;
        totalPeopleAdminSpan.textContent = totalPeopleAll;
        totalFemalesAdminSpan.textContent = totalFemalesAll;
        totalInternalMigrantsAdminSpan.textContent = totalInternalMigrantsAll;
        totalExternalMigrantsAdminSpan.textContent = totalExternalMigrantsAll;
        ageGroup18_35_AdminSpan.textContent = count18_35_All;
        ageGroup36_55_AdminSpan.textContent = count36_55_All;
        ageGroup56_65_AdminSpan.textContent = count56_65_All;
        ageGroup66Plus_AdminSpan.textContent = count66Plus_All;
        ageGroup18_35_Female_AdminSpan.textContent = count18_35_Female_All;
        ageGroup36_55_Female_AdminSpan.textContent = count36_55_Female_All;
        ageGroup56_65_Female_AdminSpan.textContent = count56_65_Female_All;
        ageGroup66Plus_Female_AdminSpan.textContent = count66Plus_Female_All;
        displayGlobalAssetSummary(allVillageData);
    };

    const openEditFamilyModalForAdmin = (villageNameCtx, familyId, familyData) => {
        if (!familyData || typeof familyData !== 'object') {
            console.error("[Admin Edit Modal] CRITICAL ERROR: familyData is invalid.");
            alert("ទិន្នន័យគ្រួសារមិនត្រឹមត្រូវដើម្បីកែសម្រួល។"); return;
        }
        if (!editFamilyModal || !editFamilyIdInput || !editFamilyVillageInput || !editFamilyHeadNameInput ||
            !editFamilyHeadPhoneAdminInput || !editFamilyMembersContainer || !editFamilyAssetsContainer ||
            !editMemberTemplateAdmin || !editMemberTemplateAdmin.content) {
            console.error("CRITICAL [Admin Edit Modal]: Essential modal DOM elements or template content missing.");
            alert("មានបញ្ហាក្នុងការបើកទម្រង់កែសម្រួល (Elements/Template ខ្វះ)។"); return;
        }
        editFamilyIdInput.value = familyData.familyId || familyId;
        editFamilyVillageInput.value = villageNameCtx || "";
        editFamilyHeadNameInput.value = familyData.familyName || "";
        editFamilyHeadPhoneAdminInput.value = familyData.headOfHouseholdPhone || "";
        editFamilyMembersContainer.innerHTML = '';
        if (familyData.members && Array.isArray(familyData.members) && familyData.members.length > 0) {
            familyData.members.forEach((member, index) => {
                if (typeof member !== 'object' || member === null) {
                    console.warn(`[Admin Edit Modal] Member data at index ${index} is invalid. Skipping.`); return;
                }
                try {
                    const memberClone = editMemberTemplateAdmin.content.cloneNode(true);
                    const memberEntryDiv = memberClone.querySelector('.member-entry');
                    if (!memberEntryDiv) {
                        console.warn("[Admin Edit Modal] '.member-entry' div not found for member:", member); return;
                    }
                    memberEntryDiv.dataset.originalMemberId = member.id || `new_admin_edit_idx_${index}_${Date.now()}`;
                    const originalIdHiddenInput = memberEntryDiv.querySelector('.member-original-id-edit');
                    if (originalIdHiddenInput) originalIdHiddenInput.value = memberEntryDiv.dataset.originalMemberId;
                    else console.warn("[Admin Edit Modal] '.member-original-id-edit' not found in template.");

                    const titleH4 = memberEntryDiv.querySelector('h4');
                    if (titleH4) {
                        const memberNameDisplay = member.name ? ` (${member.name.substring(0,15)}${member.name.length > 15 ? '...' : ''})` : '';
                        titleH4.innerHTML = `សមាជិក${memberNameDisplay} <button type="button" class="remove-member-edit-button" title="ដកសមាជិកនេះចេញ">×</button>`;
                        const removeBtn = titleH4.querySelector('.remove-member-edit-button');
                        if (removeBtn) removeBtn.onclick = (e) => { e.preventDefault(); memberEntryDiv.remove(); };
                    }
                    memberFieldDefinitionsForEdit.forEach(def => {
                        const inputEl = memberEntryDiv.querySelector(`.${def.classSuffix}`);
                        if (inputEl) {
                            const valueFromData = member[def.prop];
                            if (valueFromData !== undefined && valueFromData !== null) {
                                if (def.type === 'date' && valueFromData) {
                                    try {
                                        const dateObj = new Date(valueFromData);
                                        inputEl.value = !isNaN(dateObj.valueOf()) ? dateObj.toISOString().split('T')[0] : valueFromData;
                                    } catch (e) { inputEl.value = valueFromData; }
                                } else { inputEl.value = valueFromData; }
                            } else {
                                inputEl.value = (inputEl.tagName === 'SELECT' && def.options && def.options.length > 0) ? def.options[0].value : '';
                            }
                        } else {
                             console.warn(`[Admin Edit Modal] Input .${def.classSuffix} for ${def.prop} NOT FOUND for member ${index + 1}.`);
                        }
                    });
                    editFamilyMembersContainer.appendChild(memberClone);
                } catch (templateError) {
                    console.error("[Admin Edit Modal] Error processing member template for member " + (index + 1) + ":", templateError);
                }
            });
        }
        editFamilyAssetsContainer.innerHTML = '';
        if (familyData.assets && typeof familyData.assets === 'object') {
            assetFieldDefinitions.forEach(fieldDef => {
                const assetDiv = document.createElement('div');
                const assetLabel = document.createElement('label');
                assetLabel.htmlFor = `edit-modal-asset-${fieldDef.id}`; assetLabel.textContent = `${fieldDef.label}:`;
                const inputField = document.createElement('input');
                inputField.type = fieldDef.type; inputField.id = `edit-modal-asset-${fieldDef.id}`; inputField.name = fieldDef.id;
                const assetValue = familyData.assets[fieldDef.id];
                inputField.value = (assetValue !== undefined && assetValue !== null) ? String(assetValue) :
                                   (fieldDef.type === 'number' ? '0' : (fieldDef.isLandArea ? "" : ""));
                if (fieldDef.type === 'number') inputField.min = "0";
                if (fieldDef.isLandArea && inputField.type === 'text' && (inputField.value === "0" || inputField.value === "")) {
                    inputField.placeholder = "0";
                    if (inputField.value === "0") inputField.value = "";
                }
                assetDiv.appendChild(assetLabel); assetDiv.appendChild(inputField);
                editFamilyAssetsContainer.appendChild(assetDiv);
            });
        }
        if(editFamilyErrorAdmin) editFamilyErrorAdmin.textContent = '';
        if(editFamilySuccessAdmin) editFamilySuccessAdmin.textContent = '';
        editFamilyModal.style.display = 'block';
    };

    if (editFamilyForm) {
        editFamilyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if(editFamilyErrorAdmin) editFamilyErrorAdmin.textContent = '';
            if(editFamilySuccessAdmin) editFamilySuccessAdmin.textContent = '';

            const familyIdToUpdate = editFamilyIdInput.value;
            const villageOfFamily = editFamilyVillageInput.value;
            const updatedHeadName = editFamilyHeadNameInput.value.trim();
            const updatedPhone = editFamilyHeadPhoneAdminInput ? editFamilyHeadPhoneAdminInput.value.trim() : "";

            if (!updatedHeadName) {
                if(editFamilyErrorAdmin) editFamilyErrorAdmin.textContent = "ឈ្មោះមេគ្រួសារមិនអាចនៅទទេបានទេ។"; return;
            }
            if (!villageOfFamily) {
                if(editFamilyErrorAdmin) editFamilyErrorAdmin.textContent = "មិនអាចកំណត់ភូមិសម្រាប់កែប្រែបានទេ។"; return;
            }

            const allDataForComparison = getVillageDataStorage();
            const originalFamilyDataForLog = JSON.parse(JSON.stringify(
                (allDataForComparison[villageOfFamily] || []).find(f => f.familyId === familyIdToUpdate) || null
            ));

            const updatedFamilyPayload = {
                familyId: familyIdToUpdate, familyName: updatedHeadName, headOfHouseholdPhone: updatedPhone,
                members: [], assets: {},
                lastModifiedByAdmin: adminUsernameFromSession, lastModifiedDate: new Date().toISOString(),
                entryDate: originalFamilyDataForLog ? originalFamilyDataForLog.entryDate : new Date().toISOString()
            };

            const memberEntriesFromForm = editFamilyMembersContainer.querySelectorAll('.member-entry');
            let editFormValidationError = false;
            for (const memberDiv of memberEntriesFromForm) {
                const nameInput = memberDiv.querySelector('.member-name-edit');
                const name = nameInput ? nameInput.value.trim() : '';
                const nationalIdInput = memberDiv.querySelector('.member-nationalId-edit');
                const electionOfficeIdInput = memberDiv.querySelector('.member-electionOfficeId-edit');
                if (name) {
                    const nationalIdValue = nationalIdInput ? nationalIdInput.value.trim() : '';
                    if (nationalIdValue !== "" && nationalIdValue.length !== 9) {
                        if(editFamilyErrorAdmin) editFamilyErrorAdmin.textContent = `សមាជិក "${name}"៖ លេខអត្តសញ្ញាណប័ណ្ណត្រូវតែមាន 9 ខ្ទង់ (បើមានបញ្ចូល)។`;
                        nationalIdInput.focus(); editFormValidationError = true; break;
                    }
                    const electionOfficeIdValue = electionOfficeIdInput ? electionOfficeIdInput.value.trim() : '';
                    if (electionOfficeIdValue !== "" && electionOfficeIdValue.length !== 4) {
                        if(editFamilyErrorAdmin) editFamilyErrorAdmin.textContent = `សមាជិក "${name}"៖ លេខការិយាល័យបោះឆ្នោតត្រូវតែមាន 4 ខ្ទង់ (បើមានបញ្ចូល)។`;
                        electionOfficeIdInput.focus(); editFormValidationError = true; break;
                    }
                    const memberDataObject = {};
                    let originalId = memberDiv.dataset.originalMemberId;
                    const hiddenIdInput = memberDiv.querySelector('.member-original-id-edit');
                    if (hiddenIdInput && hiddenIdInput.value) originalId = hiddenIdInput.value;
                    memberDataObject.id = originalId;
                    if (memberDataObject.id && (memberDataObject.id.startsWith('new_admin_edit_idx_') || memberDataObject.id.startsWith('new_admin_form_'))) {
                        memberDataObject.id = `mem_${Date.now()}_${Math.random().toString(36).substr(2,5)}`;
                    }
                    memberFieldDefinitionsForEdit.forEach(def => {
                        const inputElem = memberDiv.querySelector(`.${def.classSuffix}`);
                        if (inputElem) memberDataObject[def.prop] = inputElem.value.trim();
                    });
                    updatedFamilyPayload.members.push(memberDataObject);
                }
            }
            if(editFormValidationError) return;

            editFamilyAssetsContainer.querySelectorAll('input[name]').forEach(assetInput => {
                const assetKey = assetInput.name;
                const assetDef = assetFieldDefinitions.find(def => def.id === assetKey);
                updatedFamilyPayload.assets[assetKey] = assetInput.type === 'number'
                    ? (parseInt(assetInput.value, 10) || 0)
                    : (assetInput.value.trim() || (assetDef?.isLandArea ? "0" : ""));
            });
            if (originalFamilyDataForLog && originalFamilyDataForLog.entryDate) {
                updatedFamilyPayload.entryDate = originalFamilyDataForLog.entryDate;
            }

            const allDataToSave = getVillageDataStorage();
            if (allDataToSave.hasOwnProperty(villageOfFamily) && Array.isArray(allDataToSave[villageOfFamily])) {
                const familyIndex = allDataToSave[villageOfFamily].findIndex(f => f.familyId === familyIdToUpdate);
                if (familyIndex > -1) {
                    updatedFamilyPayload.entryDate = allDataToSave[villageOfFamily][familyIndex].entryDate;
                    allDataToSave[villageOfFamily][familyIndex] = updatedFamilyPayload;
                    saveVillageDataStorage(allDataToSave);

                    if(editFamilySuccessAdmin) editFamilySuccessAdmin.textContent = 'ទិន្នន័យគ្រួសារបានកែសម្រួលជោគជ័យ!';
                    const currentSelectedVillage = villageSelect ? villageSelect.value : null;
                    const currentSearchTerm = searchFamilyInput ? searchFamilyInput.value : '';
                    loadFamilyDataForSelectedVillageAdmin(currentSelectedVillage, currentSearchTerm);
                    calculateAdminSummary();
                    loadAndDisplayActivityLog();

                    setTimeout(() => {
                        if(editFamilyModal) editFamilyModal.style.display = 'none';
                        if(editFamilySuccessAdmin) editFamilySuccessAdmin.textContent = '';
                    }, 2000);
                } else {
                    if(editFamilyErrorAdmin) editFamilyErrorAdmin.textContent = `រកមិនឃើញទិន្នន័យគ្រួសារ ID ${familyIdToUpdate} ក្នុងភូមិ ${villageOfFamily}។`;
                }
            } else {
                if(editFamilyErrorAdmin) editFamilyErrorAdmin.textContent = `មិនមានទិន្នន័យសម្រាប់ភូមិ ${villageOfFamily}។`;
            }
        });
    }

    if (addMemberToEditFormButton) {
        addMemberToEditFormButton.onclick = () => {
            if (editFamilyMembersContainer.children.length < MAX_MEMBERS_EDIT) {
                if (!editMemberTemplateAdmin || !editMemberTemplateAdmin.content) {
                    console.error("[Admin Edit] editMemberTemplateAdmin or its content is not available."); return;
                }
                const memberClone = editMemberTemplateAdmin.content.cloneNode(true);
                const memberEntryDiv = memberClone.querySelector('.member-entry');
                if (!memberEntryDiv) {
                    console.warn("[Admin Edit] '.member-entry' div not found in template for new member."); return;
                }
                const newMemberOriginalId = `new_admin_form_${Date.now()}`;
                memberEntryDiv.dataset.originalMemberId = newMemberOriginalId;
                const originalIdHiddenInput = memberEntryDiv.querySelector('.member-original-id-edit');
                if(originalIdHiddenInput) originalIdHiddenInput.value = newMemberOriginalId;
                else console.warn("[Admin Edit] '.member-original-id-edit' not found in new member template.");

                const titleH4 = memberEntryDiv.querySelector('h4');
                if (titleH4) {
                    titleH4.innerHTML = `សមាជិកថ្មី <button type="button" class="remove-member-edit-button" title="ដកសមាជិកនេះចេញ">×</button>`;
                    const removeBtn = titleH4.querySelector('.remove-member-edit-button');
                    if (removeBtn) removeBtn.onclick = (e) => { e.preventDefault(); memberEntryDiv.remove(); };
                }
                memberEntryDiv.querySelectorAll('input[type="text"], input[type="date"], input[type="tel"]').forEach(input => input.value = '');
                memberEntryDiv.querySelectorAll('select').forEach(select => select.selectedIndex = 0);
                editFamilyMembersContainer.appendChild(memberClone);
            } else {
                alert(`មិនអាចបន្ថែមសមាជិកលើសពី ${MAX_MEMBERS_EDIT} នាក់បានទេ។`);
            }
        };
    }

    if (closeEditFamilyModalButton && editFamilyModal) {
        closeEditFamilyModalButton.onclick = () => { editFamilyModal.style.display = 'none'; };
    }
    window.onclick = (event) => {
        if (event.target === editFamilyModal && editFamilyModal) {
            editFamilyModal.style.display = 'none';
        }
    };

    const deleteFamilyDataForAdmin = (villageOfFamily, familyIdToDelete, familyNameToConfirm = '') => {
        const confirmMsg = familyNameToConfirm
            ? `តើអ្នកពិតជាចង់លុបទិន្នន័យគ្រួសារ "${familyNameToConfirm}" (ID: ${familyIdToDelete}) ពីភូមិ "${villageOfFamily}" មែនទេ?`
            : `តើអ្នកពិតជាចង់លុបទិន្នន័យគ្រួសារ ID: ${familyIdToDelete} ពីភូមិ "${villageOfFamily}" មែនទេ?`;

        if (!confirm(confirmMsg)) return;
        const allVillageData = getVillageDataStorage();
        if (allVillageData.hasOwnProperty(villageOfFamily) && Array.isArray(allVillageData[villageOfFamily])) {
            const initialLength = allVillageData[villageOfFamily].length;
            allVillageData[villageOfFamily] = allVillageData[villageOfFamily].filter(family => family.familyId !== familyIdToDelete);
            if (allVillageData[villageOfFamily].length < initialLength) {
                saveVillageDataStorage(allVillageData);
                loadFamilyDataForSelectedVillageAdmin(villageSelect.value, searchFamilyInput.value);
                calculateAdminSummary();
                loadAndDisplayActivityLog();
                alert(`ទិន្នន័យគ្រួសារ "${familyNameToConfirm || familyIdToDelete}" ត្រូវបានលុប។`);
            } else { alert('រកមិនឃើញទិន្នន័យគ្រួសារដែលត្រូវលុប។'); }
        } else { alert(`មិនមានទិន្នន័យសម្រាប់ភូមិ ${villageOfFamily} ដើម្បីលុប។`); }
    };

    const generateAndDisplayDailyReport = () => {
        if (!reportDateSpan || !dailyReportContentDiv) return;
        const today = new Date();
        reportDateSpan.textContent = today.toLocaleDateString('km-KH', {day: '2-digit', month: 'long', year: 'numeric'});
        dailyReportContentDiv.innerHTML = '';
        const allVillageData = getVillageDataStorage();
        const todayStr = today.toISOString().split('T')[0];
        let reportHTML = '<ul>'; let entriesTodayCount = 0;
        for (const vName in allVillageData) {
            if (allVillageData.hasOwnProperty(vName) && Array.isArray(allVillageData[vName])) {
                const familiesEnteredTodayInVillage = allVillageData[vName].filter(f => f.entryDate && String(f.entryDate).startsWith(todayStr));
                if (familiesEnteredTodayInVillage.length > 0) {
                    reportHTML += `<li><strong>ភូមិ ${vName}:</strong> ${familiesEnteredTodayInVillage.length} គ្រួសារ`;
                    entriesTodayCount += familiesEnteredTodayInVillage.length;
                }
            }
        }
        if (entriesTodayCount === 0) reportHTML += '<li><em>មិនមានការបញ្ចូលទិន្នន័យថ្មីសម្រាប់ថ្ងៃនេះទេ។</em></li>';
        reportHTML += '</ul>';
        dailyReportContentDiv.innerHTML = reportHTML;
    };
    if (generateDailyReportButton) {
        generateDailyReportButton.addEventListener('click', generateAndDisplayDailyReport);
        if(reportDateSpan) reportDateSpan.textContent = new Date().toLocaleDateString('km-KH', {day: '2-digit', month: 'long', year: 'numeric'});
    }

    const performAdminFamilySearch = () => {
        if (!searchFamilyInput || !villageSelect) return;
        const searchTerm = searchFamilyInput.value.trim();
        const selectedVillage = villageSelect.value;
        loadFamilyDataForSelectedVillageAdmin(selectedVillage, searchTerm);
    };

    if (searchFamilyButton) searchFamilyButton.addEventListener('click', performAdminFamilySearch);
    if (searchFamilyInput) {
        searchFamilyInput.addEventListener('keypress', e => { if (e.key === 'Enter') performAdminFamilySearch(); });
        searchFamilyInput.addEventListener('input', (e) => {
            if (e.target.value.trim() === '') {
                const selectedVillage = villageSelect ? villageSelect.value : null;
                loadFamilyDataForSelectedVillageAdmin(selectedVillage);
            }
        });
    }

    const checkAndShowPrintButton = (villageName) => {
        // This function is no longer relevant for a global print button.
        // If you had a global print button with id 'print-village-data-button', it's removed from HTML.
    };
    checkAndShowPrintButton(); // Call to hide any potential old global print button if its ID still exists


    const loadAndDisplayActivityLog = () => {
        if (!activityLogTbody) {
            console.warn("Admin: Activity log tbody element not found.");
            return;
        }
        activityLogTbody.innerHTML = '';
        let log = [];
        const storedLog = localStorage.getItem(ACTIVITY_LOG_KEY);
        if (storedLog) {
            try {
                log = JSON.parse(storedLog);
                if (!Array.isArray(log)) log = [];
            } catch (e) { console.error("Admin: Error parsing activity log:", e); log = []; }
        }
        if (log.length === 0) {
            const row = activityLogTbody.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 6;
            cell.textContent = 'មិនទាន់មានសកម្មភាពកត់ត្រាទេ។';
            cell.style.textAlign = 'center';
            return;
        }
        log.forEach(entry => {
            const row = activityLogTbody.insertRow();
            const timestamp = new Date(entry.timestamp);
            const formattedTime = `${timestamp.toLocaleDateString('km-KH', {day: '2-digit', month: '2-digit', year: 'numeric'})} ${timestamp.toLocaleTimeString('km-KH', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}`;
            row.insertCell().textContent = formattedTime;
            row.insertCell().textContent = entry.villageName || 'N/A';
            let actionText = entry.action || 'N/A';
            if (entry.action === 'EDITED_FAMILY') actionText = 'កែសម្រួលគ្រួសារ';
            else if (entry.action === 'DELETED_FAMILY') actionText = 'លុបគ្រួសារ';
            row.insertCell().textContent = actionText;
            row.insertCell().textContent = entry.familyName ? `${entry.familyName} (ID: ${entry.familyId ? entry.familyId.slice(-6) : 'N/A'})` : (entry.familyId || 'N/A');
            const detailsCell = row.insertCell();
            detailsCell.innerHTML = (entry.details || 'N/A').replace(/;\s*\n?/g, '<br>');
            detailsCell.style.fontSize = '0.85em';
            detailsCell.style.maxWidth = '350px';
            detailsCell.style.wordBreak = 'break-word';
            row.insertCell().textContent = entry.modifiedBy || 'N/A';
        });
    };

    // --- Event Listeners ---
    if (villageSelect) {
        villageSelect.addEventListener('change', (e) => {
            const selectedVillage = e.target.value;
            if(searchFamilyInput) searchFamilyInput.value = '';
            loadFamilyDataForSelectedVillageAdmin(selectedVillage);
        });
    }
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            sessionStorage.clear();
            window.location.href = 'index.html';
        });
    }

    // --- Initial Calls for Admin Dashboard ---
    if (typeof loadRegisteredVillagesList === 'function') loadRegisteredVillagesList();
    if (typeof calculateAdminSummary === 'function') calculateAdminSummary();
    if (typeof loadFamilyDataForSelectedVillageAdmin === 'function') loadFamilyDataForSelectedVillageAdmin(null);
    if (typeof loadAndDisplayActivityLog === 'function') loadAndDisplayActivityLog();

});
