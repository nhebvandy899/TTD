// admin_script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Early check for essential elements and user validation ---
    const userType = sessionStorage.getItem('loggedInUserType');
    const adminUsernameFromSession = sessionStorage.getItem('loggedInUsername');

    if (userType !== 'admin' || !adminUsernameFromSession) {
        alert('សូមចូលប្រើជា Admin ជាមុនសិន!');
        sessionStorage.clear();
        window.location.href = 'index.html';
        return; // Stop script execution if not admin
    }

    // --- DOM References ---
    const welcomeMessage = document.getElementById('welcome-message');
    const adminCurrentDateTimeDisplay = document.getElementById('admin-current-date-time');
    const logoutButton = document.getElementById('logout-button');
    const villageTableBody = document.getElementById('village-table-body');
    const villageSelect = document.getElementById('village-select');
    const totalFamiliesAdminSpan = document.getElementById('total-families-admin');
    const totalPeopleAdminSpan = document.getElementById('total-people-admin');
    const totalFemalesAdminSpan = document.getElementById('total-females-admin');
    const totalVillagesAdminSpan = document.getElementById('total-villages-admin');
    // *** DOM Elements for Migration Stats ***
    const totalInternalMigrantsAdminSpan = document.getElementById('total-internal-migrants-admin');
    const totalExternalMigrantsAdminSpan = document.getElementById('total-external-migrants-admin');
    // *** End DOM Elements for Migration Stats ***
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
    const printVillageDataButton = document.getElementById('print-village-data-button');

    const MAX_MEMBERS_EDIT = 9;

    // --- Welcome Message Update ---
    if (welcomeMessage) {
        welcomeMessage.textContent = `សូមស្វាគមន៍, ${adminUsernameFromSession}! (Admin)`;
    }

    // --- Function to Display Current Date and Time in Khmer (Manual Formatting for Admin) ---
    const displayCurrentDateTimeForAdmin = () => {
        if (!adminCurrentDateTimeDisplay) {
            return;
        }
        const now = new Date();
        const daysKhmer = ["អាទិត្យ", "ច័ន្ទ", "អង្គារ", "ពុធ", "ព្រហស្បត្តិ៍", "សុក្រ", "សៅរ៍"];
        const monthsKhmer = [
            "មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា",
            "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"
        ];
        const dayName = daysKhmer[now.getDay()];
        const dayOfMonth = now.getDate();
        const monthName = monthsKhmer[now.getMonth()];
        const year = now.getFullYear();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'ល្ងាច' : 'ព្រឹក';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const hoursStr = hours.toString();
        const timeString = `ម៉ោង ${hoursStr}:<span style="color: #28a745;">${minutes}</span>:<span style="color: #28a745;">${seconds}</span> ${ampm}`;
        adminCurrentDateTimeDisplay.innerHTML = `ថ្ងៃ${dayName} ទី${dayOfMonth} ខែ${monthName} ឆ្នាំ${year} ${timeString}`;
    };

    // --- Call Time Display Function Immediately and Set Interval ---
    if (typeof displayCurrentDateTimeForAdmin === 'function') {
        displayCurrentDateTimeForAdmin();
        setInterval(displayCurrentDateTimeForAdmin, 1000);
    } else {
        console.error("displayCurrentDateTimeForAdmin function is not defined.");
    }

    // --- LocalStorage Keys and Access Functions ---
    const VILLAGES_KEY = 'registeredVillages_v2';
    const VILLAGE_DATA_KEY = 'villageData_v2';

    const getRegisteredVillages = () => {
        const villages = localStorage.getItem(VILLAGES_KEY);
        try { const p = JSON.parse(villages); return typeof p === 'object' && p !== null ? p : {}; }
        catch (e) { console.error("Admin: Error parsing registered villages", e); return {}; }
    };
    const getVillageDataStorage = () => {
        const data = localStorage.getItem(VILLAGE_DATA_KEY);
        try { const p = JSON.parse(data); return typeof p === 'object' && p !== null ? p : {}; }
        catch (e) { console.error("Admin: Error parsing village data", e); return {}; }
    };
    const saveVillageDataStorage = (data) => {
        if (typeof data === 'object' && data !== null) localStorage.setItem(VILLAGE_DATA_KEY, JSON.stringify(data));
        else console.error("Admin: Attempted to save invalid data to villageData");
    };
    const saveRegisteredVillages = (villages) => {
        if (typeof villages === 'object' && villages !== null) localStorage.setItem(VILLAGES_KEY, JSON.stringify(villages));
        else console.error("Admin: Attempted to save invalid registered villages data");
    };

    // --- Field Definitions ---
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
            villageSelect.disabled = true;
            return;
        }
        villageSelect.disabled = false;

        villageNames.forEach(name => {
            const villageInfo = registeredVillages[name];
            if (villageTableBody) {
                const row = villageTableBody.insertRow();
                row.insertCell().textContent = name;
                row.insertCell().textContent = villageInfo?.phone || 'N/A';

                const permissionCell = row.insertCell();
                permissionCell.style.textAlign = 'center';
                const permissionButton = document.createElement('button');
                permissionButton.classList.add('permission-toggle-button');
                permissionButton.dataset.villageName = name;
                if (villageInfo.canEditData) {
                    permissionButton.textContent = 'បិទសិទ្ធិកែ';
                    permissionButton.style.backgroundColor = '#28a745';
                } else {
                    permissionButton.textContent = 'បើកសិទ្ធិកែ';
                    permissionButton.style.backgroundColor = '#dc3545';
                }
                permissionButton.onclick = () => toggleVillageEditPermission(name);
                permissionCell.appendChild(permissionButton);

                const actionCell = row.insertCell();
                const viewButton = document.createElement('button');
                viewButton.textContent = 'មើល Dashboard ភូមិ';
                viewButton.onclick = () => {
                    sessionStorage.setItem('adminViewingVillage', name);
                    window.location.href = 'dashboard.html';
                };
                actionCell.appendChild(viewButton);
            }
            if (villageSelect) {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                villageSelect.appendChild(option);
            }
        });
    };

    const toggleVillageEditPermission = (villageName) => {
        const registeredVillages = getRegisteredVillages();
        if (registeredVillages[villageName]) {
            registeredVillages[villageName].canEditData = !registeredVillages[villageName].canEditData;
            saveRegisteredVillages(registeredVillages);
            loadRegisteredVillagesList();
            alert(`សិទ្ធិកែសម្រួលសម្រាប់មេភូមិ "${villageName}" ត្រូវបាន ${registeredVillages[villageName].canEditData ? 'បើក' : 'បិទ'}។`);
        } else {
            alert(`រកមិនឃើញភូមិ "${villageName}" ដើម្បីកែប្រែសិទ្ធិ។`);
        }
    };

    const renderFamilyCardForAdmin = (familyData, containerElement, villageContextName) => {
         if (!familyCardTemplate) { console.error("Family card template is missing for admin view!"); return; }
         const cardClone = familyCardTemplate.content.cloneNode(true);
         const familyCard = cardClone.querySelector('.family-card');
         if (!familyCard) { console.error("Family card element not found in template for admin view!"); return; }

         familyCard.dataset.familyId = familyData.familyId;
         familyCard.dataset.village = villageContextName;

         const cardNameEl = familyCard.querySelector('.family-card-name');
         if (cardNameEl) cardNameEl.textContent = `${familyData.familyName || 'N/A'} (ភូមិ ${villageContextName})`;

         const cardDateEl = familyCard.querySelector('.family-card-entry-date');
         if (cardDateEl) {
             try {
                 cardDateEl.textContent = `កាលបរិច្ឆេទបញ្ចូល: ${new Date(familyData.entryDate).toLocaleDateString('km-KH', { day: '2-digit', month: 'short', year: 'numeric' })}`;
             } catch { cardDateEl.textContent = `កាលបរិច្ឆេទបញ្ចូល: មិនត្រឹមត្រូវ`; }
         }

         const membersTableBody = familyCard.querySelector('.members-table tbody');
         let familyMemberCount = 0;
         if (familyData.members && Array.isArray(familyData.members) && membersTableBody) {
             familyMemberCount = familyData.members.length;
             membersTableBody.innerHTML = '';
             if (familyMemberCount > 0) {
                familyData.members.forEach(member => {
                    const row = membersTableBody.insertRow();
                    row.insertCell().textContent = member.name || 'N/A';
                    row.insertCell().textContent = member.gender || 'N/A';
                    row.insertCell().textContent = member.dob ? new Date(member.dob).toLocaleDateString('km-KH', {day:'2-digit', month:'2-digit', year:'numeric'}) : 'N/A';
                    row.insertCell().textContent = member.birthProvince || 'N/A';
                    row.insertCell().textContent = member.educationLevel || 'N/A';
                    row.insertCell().textContent = member.occupation || 'N/A';
                    row.insertCell().textContent = member.nationalId || 'N/A';
                    row.insertCell().textContent = member.electionOfficeId || 'N/A';
                    row.insertCell().textContent = member.internalMigration || 'N/A';
                    row.insertCell().textContent = member.externalMigration || 'N/A';
                });
             } else {
                const row = membersTableBody.insertRow();
                const cell = row.insertCell();
                cell.colSpan = 10;
                cell.textContent = "មិនមានសមាជិកគ្រួសារ។";
                cell.style.textAlign = "center";
             }
         }
         const memberCountEl = familyCard.querySelector('.family-member-count');
         if (memberCountEl) memberCountEl.textContent = familyMemberCount;

         const assetsDiv = familyCard.querySelector('.assets-details');
         if (assetsDiv) {
             assetsDiv.innerHTML = '';
             let hasReportedAssetsInCard = false;
             if (familyData.assets) {
                 assetFieldDefinitions.forEach(def => {
                    const assetValue = familyData.assets[def.id];
                    if (assetValue !== undefined && assetValue !== null && String(assetValue).trim() !== "" && String(assetValue).trim() !== "0") {
                         const p = document.createElement('p');
                         p.innerHTML = `<strong>${def.label}:</strong> ${assetValue}`;
                         assetsDiv.appendChild(p);
                         hasReportedAssetsInCard = true;
                     }
                 });
             }
             if (!hasReportedAssetsInCard) {
                 assetsDiv.innerHTML = '<p><em>មិនមានទ្រព្យសម្បត្តិ/អាជីវកម្ម។</em></p>';
             }
         }

         const actionsDiv = familyCard.querySelector('.family-card-actions');
         if (actionsDiv) {
             actionsDiv.style.display = 'block';
             const editBtn = actionsDiv.querySelector('.edit-family-button');
             const deleteBtn = actionsDiv.querySelector('.delete-family-button');
             if (editBtn) editBtn.onclick = () => openEditFamilyModalForAdmin(villageContextName, familyData.familyId, familyData);
             if (deleteBtn) deleteBtn.onclick = () => deleteFamilyDataForAdmin(villageContextName, familyData.familyId, familyData.familyName);
         }
         containerElement.appendChild(cardClone);
    };

    const loadFamilyDataForSelectedVillageAdmin = (villageName, searchTerm = '') => {
         if (!familyListContainerAdmin || !selectedVillageNameH3 || !noFamilyDataMessageAdmin) return;
         familyListContainerAdmin.innerHTML = '';
         noFamilyDataMessageAdmin.style.display = 'none';
         checkAndShowPrintButton(null);

         if (!villageName && !searchTerm) {
            selectedVillageNameH3.textContent = 'ទិន្នន័យគ្រួសារ: [មិនបានជ្រើសរើសភូមិ]';
            noFamilyDataMessageAdmin.textContent = 'សូមជ្រើសរើសភូមិដើម្បីបង្ហាញទិន្នន័យ ឬធ្វើការស្វែងរកក្នុងភូមិដែលបានជ្រើសរើស។';
            noFamilyDataMessageAdmin.style.display = 'block';
            return;
         }

         const allVillageData = getVillageDataStorage();
         let familiesToDisplay = [];

         if (villageName && !searchTerm) {
            selectedVillageNameH3.textContent = `ទិន្នន័យគ្រួសារសម្រាប់ភូមិ: ${villageName}`;
            familiesToDisplay = (allVillageData[villageName] && Array.isArray(allVillageData[villageName])) ? [...allVillageData[villageName]] : [];
            checkAndShowPrintButton(villageName);
         } else if (villageName && searchTerm) {
            selectedVillageNameH3.textContent = `លទ្ធផលស្វែងរកក្នុងភូមិ ${villageName} សម្រាប់: "${searchTerm}"`;
            const familiesInSelectedVillage = (allVillageData[villageName] && Array.isArray(allVillageData[villageName])) ? allVillageData[villageName] : [];
            const searchTermLower = searchTerm.toLowerCase();
            familiesToDisplay = familiesInSelectedVillage.filter(family => {
                let match = (family.familyName && family.familyName.toLowerCase().includes(searchTermLower));
                if (!match && family.members && Array.isArray(family.members)) {
                    match = family.members.some(mem =>
                        (mem.name && mem.name.toLowerCase().includes(searchTermLower)) ||
                        (mem.nationalId && mem.nationalId.includes(searchTermLower))
                    );
                }
                return match;
            });
            checkAndShowPrintButton(villageName);
         } else if (!villageName && searchTerm) {
            selectedVillageNameH3.textContent = `លទ្ធផលស្វែងរកសកលសម្រាប់: "${searchTerm}"`;
            const searchTermLower = searchTerm.toLowerCase();
            for (const vName in allVillageData) {
                if (allVillageData.hasOwnProperty(vName) && Array.isArray(allVillageData[vName])) {
                    allVillageData[vName].forEach(family => {
                        let match = (family.familyName && family.familyName.toLowerCase().includes(searchTermLower));
                        if (!match && family.members && Array.isArray(family.members)) {
                             match = family.members.some(mem =>
                                (mem.name && mem.name.toLowerCase().includes(searchTermLower)) ||
                                (mem.nationalId && mem.nationalId.includes(searchTermLower))
                            );
                        }
                        if (match) {
                            familiesToDisplay.push({ ...family, _villageContextForDisplay: vName });
                        }
                    });
                }
            }
         }

         if (familiesToDisplay.length > 0) {
             familiesToDisplay.sort((a, b) => new Date(b.entryDate) - new Date(a.entryDate));
             familiesToDisplay.forEach(family => {
                 renderFamilyCardForAdmin(family, familyListContainerAdmin, family._villageContextForDisplay || villageName);
             });
         } else {
             noFamilyDataMessageAdmin.textContent = searchTerm
                ? `រកមិនឃើញលទ្ធផលសម្រាប់ "${searchFamilyInput.value}"${villageName ? ` នៅក្នុងភូមិ ${villageName}` : ' ទូទាំងប្រព័ន្ធ'}។`
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
                    if (family.assets) {
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
                if (totalValue > 0 || (def.isLandArea && totalValue !== undefined)) hasAnyGlobalAssets = true;

                if (def.isLandArea) {
                    const formattedHectares = parseFloat(totalValue.toFixed(4));
                    totalCell.textContent = `${formattedHectares} ហិចតា`;
                } else {
                    totalCell.textContent = totalValue;
                }
            } else {
                totalCell.textContent = def.isLandArea ? '0 ហិចតា' : (def.type === 'number' ? '0' : '-');
            }
        });
         if (!hasAnyGlobalAssets && Object.keys(allVillageData).length > 0) {
            adminAssetSummaryTbody.innerHTML = '<tr><td colspan="2"><em>មិនមានទិន្នន័យទ្រព្យសម្បត្តិសរុបដែលបានរាយការណ៍។</em></td></tr>';
         } else if (Object.keys(allVillageData).length === 0) {
            adminAssetSummaryTbody.innerHTML = '<tr><td colspan="2"><em>មិនមានទិន្នន័យភូមិដើម្បីគណនា។</em></td></tr>';
         }
    };

    const calculateAdminSummary = () => {
        if (!totalVillagesAdminSpan || !totalFamiliesAdminSpan || !totalPeopleAdminSpan || !totalFemalesAdminSpan ||
            !totalInternalMigrantsAdminSpan || !totalExternalMigrantsAdminSpan) { // Check new spans too
            console.warn("One or more admin summary span elements are missing from the DOM.");
            return;
        }

        const allVillageData = getVillageDataStorage();
        let totalFamiliesAll = 0;
        let totalPeopleAll = 0;
        let totalFemalesAll = 0;
        let totalInternalMigrantsAll = 0; // <<< Initialize
        let totalExternalMigrantsAll = 0; // <<< Initialize
        let villageCount = Object.keys(getRegisteredVillages()).length;

        for (const villageNameKey in allVillageData) {
            if (allVillageData.hasOwnProperty(villageNameKey) && Array.isArray(allVillageData[villageNameKey])) {
                const familiesInThisVillage = allVillageData[villageNameKey];
                totalFamiliesAll += familiesInThisVillage.length;

                familiesInThisVillage.forEach(family => {
                    if (family.members && Array.isArray(family.members)) {
                        totalPeopleAll += family.members.length;
                        family.members.forEach(member => {
                            if (member.gender === 'ស្រី') {
                                totalFemalesAll++;
                            }
                            if (member.internalMigration === 'បាទ') { // Assuming 'បាទ' means Yes
                                totalInternalMigrantsAll++;
                            }
                            if (member.externalMigration === 'បាទ') { // Assuming 'បាទ' means Yes
                                totalExternalMigrantsAll++;
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
        totalInternalMigrantsAdminSpan.textContent = totalInternalMigrantsAll; // <<< Update DOM
        totalExternalMigrantsAdminSpan.textContent = totalExternalMigrantsAll; // <<< Update DOM

        displayGlobalAssetSummary(allVillageData);
    };

    const openEditFamilyModalForAdmin = (villageNameCtx, familyId, familyData) => {
        if (!editFamilyModal || !editFamilyIdInput || !editFamilyVillageInput || !editFamilyHeadNameInput || !editFamilyMembersContainer || !editFamilyAssetsContainer || !editMemberTemplateAdmin) {
            console.error("Admin edit modal elements missing."); return;
        }
        editFamilyIdInput.value = familyId;
        editFamilyVillageInput.value = villageNameCtx;
        editFamilyHeadNameInput.value = familyData.familyName || "";
        if (editFamilyHeadPhoneAdminInput) editFamilyHeadPhoneAdminInput.value = familyData.headOfHouseholdPhone || "";


        editFamilyMembersContainer.innerHTML = '';
        if (familyData.members && Array.isArray(familyData.members)) {
            familyData.members.forEach((member, index) => {
                const memberClone = editMemberTemplateAdmin.content.cloneNode(true);
                const memberEntry = memberClone.querySelector('.member-entry');
                if (!memberEntry) return;

                const originalIdInput = memberEntry.querySelector('.member-original-id-edit');
                if (originalIdInput) originalIdInput.value = member.id || `new_admin_edit_${index}`;

                const titleElement = memberEntry.querySelector('h4');
                if (titleElement) {
                    titleElement.innerHTML = `សមាជិក${member.id ? '' : 'ថ្មី'} (កែសម្រួល) <button type="button" class="remove-member-edit-button" title="ដកសមាជិកនេះចេញ">×</button>`;
                    const removeBtn = titleElement.querySelector('.remove-member-edit-button');
                    if (removeBtn) removeBtn.onclick = (e) => { e.preventDefault(); memberEntry.remove(); };
                }

                memberFieldDefinitionsForEdit.forEach(def => {
                    const inputEl = memberEntry.querySelector(`.${def.classSuffix}`);
                    if (inputEl) {
                        const valueFromData = member[def.prop];
                        if (valueFromData !== undefined && valueFromData !== null) {
                            if (def.type === 'date' && valueFromData) {
                                try { inputEl.value = new Date(valueFromData).toISOString().split('T')[0]; }
                                catch(e) { inputEl.value = valueFromData; }
                            } else {
                                inputEl.value = valueFromData;
                            }
                        } else {
                            if (inputEl.tagName === 'SELECT') inputEl.selectedIndex = 0; else inputEl.value = '';
                        }
                    }
                });
                editFamilyMembersContainer.appendChild(memberClone);
            });
        }

        editFamilyAssetsContainer.innerHTML = '';
        assetFieldDefinitions.forEach(fieldDef => {
            const div = document.createElement('div');
            const label = document.createElement('label');
            label.htmlFor = `edit-${fieldDef.id}`;
            label.textContent = fieldDef.label + ':';
            const input = document.createElement('input');
            input.type = fieldDef.type;
            input.id = `edit-${fieldDef.id}`;
            input.name = fieldDef.id;
            const existingValue = (familyData.assets && familyData.assets[fieldDef.id] !== undefined)
                ? familyData.assets[fieldDef.id]
                : (input.type === 'number' ? '0' : (fieldDef.isLandArea ? "0" : ""));
            input.value = existingValue;
            if(input.type === 'number') input.min = "0";
            if(input.type === 'text' && (input.value === '0' || input.value === '') && fieldDef.id.toLowerCase().includes('landsize')) {
                 input.placeholder = "0"; input.value = "";
             }
            div.appendChild(label); div.appendChild(input);
            editFamilyAssetsContainer.appendChild(div);
        });

        if(editFamilyErrorAdmin) editFamilyErrorAdmin.textContent = '';
        if(editFamilySuccessAdmin) editFamilySuccessAdmin.textContent = '';
        editFamilyModal.style.display = 'block';
    };

    if(addMemberToEditFormButton) {
         addMemberToEditFormButton.onclick = () => {
             if (editFamilyMembersContainer.children.length < MAX_MEMBERS_EDIT) {
                 const memberClone = editMemberTemplateAdmin.content.cloneNode(true);
                 const memberEntry = memberClone.querySelector('.member-entry'); if(!memberEntry) return;
                 const originalIdInput = memberEntry.querySelector('.member-original-id-edit');
                 if (originalIdInput) originalIdInput.value = `new_admin_${Date.now()}`;
                 const titleElement = memberEntry.querySelector('h4');
                 if(titleElement) {
                     titleElement.innerHTML = `សមាជិកថ្មី (កែសម្រួល) <button type="button" class="remove-member-edit-button" title="ដកសមាជិកនេះចេញ">×</button>`;
                     const removeBtn = titleElement.querySelector('.remove-member-edit-button');
                     if (removeBtn) removeBtn.onclick = (e) => {e.preventDefault(); memberEntry.remove();};
                 }
                 memberEntry.querySelectorAll('input[type="text"], input[type="date"]').forEach(input => input.value = '');
                 memberEntry.querySelectorAll('select').forEach(select => select.selectedIndex = 0);
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
        if (event.target == editFamilyModal && editFamilyModal) editFamilyModal.style.display = 'none';
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
                if(editFamilyErrorAdmin) editFamilyErrorAdmin.textContent = "មិនអាចកំណត់ភូមិសម្រាប់កែប្រែទិន្នន័យបានទេ។"; return;
            }

            const updatedFamilyPayload = {
                familyId: familyIdToUpdate,
                familyName: updatedHeadName,
                headOfHouseholdPhone: updatedPhone,
                members: [],
                assets: {},
                lastModifiedByAdmin: adminUsernameFromSession,
                lastModifiedDate: new Date().toISOString()
            };

            const memberEntries = editFamilyMembersContainer.querySelectorAll('.member-entry');
            memberEntries.forEach(entry => {
                const nameInput = entry.querySelector('.member-name-edit');
                const name = nameInput ? nameInput.value.trim() : '';
                if (name) {
                    const memberObj = {
                        id: entry.querySelector('.member-original-id-edit')?.value || ''
                    };
                    if (memberObj.id.startsWith('new_admin_')) {
                        memberObj.id = `mem_${Date.now()}_${Math.random().toString(36).substr(2,5)}`;
                    }
                    memberFieldDefinitionsForEdit.forEach(def => {
                        const inputEl = entry.querySelector(`.${def.classSuffix}`);
                        if (inputEl) memberObj[def.prop] = inputEl.value.trim() || (inputEl.tagName === 'SELECT' && def.options && def.options.length > 0 ? def.options[0].value : '');
                    });
                    updatedFamilyPayload.members.push(memberObj);
                }
            });

            const assetEditInputs = editFamilyAssetsContainer.querySelectorAll('input[name]');
            assetEditInputs.forEach(input => {
                const assetKey = input.name;
                updatedFamilyPayload.assets[assetKey] = input.type === 'number'
                    ? (parseInt(input.value, 10) || 0)
                    : (input.value.trim() || (input.id.toLowerCase().includes('landsize') ? "0" : ""));
            });

            const allData = getVillageDataStorage();
            if (allData.hasOwnProperty(villageOfFamily) && Array.isArray(allData[villageOfFamily])) {
                const familyIndex = allData[villageOfFamily].findIndex(f => f.familyId === familyIdToUpdate);
                if (familyIndex > -1) {
                    updatedFamilyPayload.entryDate = allData[villageOfFamily][familyIndex].entryDate;
                    allData[villageOfFamily][familyIndex] = updatedFamilyPayload;
                    saveVillageDataStorage(allData);

                    if(editFamilySuccessAdmin) editFamilySuccessAdmin.textContent = 'ទិន្នន័យគ្រួសារបានកែសម្រួលជោគជ័យ!';
                    loadFamilyDataForSelectedVillageAdmin(villageSelect.value, searchFamilyInput.value);
                    calculateAdminSummary();
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
                alert(`ទិន្នន័យគ្រួសារ "${familyNameToConfirm || familyIdToDelete}" ត្រូវបានលុប។`);
            } else {
                alert('រកមិនឃើញទិន្នន័យគ្រួសារដែលត្រូវលុប។');
            }
        } else {
            alert(`មិនមានទិន្នន័យសម្រាប់ភូមិ ${villageOfFamily} ដើម្បីលុប។`);
        }
    };

    const generateAndDisplayDailyReport = () => {
        if (!reportDateSpan || !dailyReportContentDiv) return;
        const today = new Date();
        reportDateSpan.textContent = today.toLocaleDateString('km-KH', {day: '2-digit', month: 'long', year: 'numeric'});
        dailyReportContentDiv.innerHTML = '';

        const allVillageData = getVillageDataStorage();
        const todayStr = today.toISOString().split('T')[0];
        let reportHTML = '<ul>';
        let entriesTodayCount = 0;

        for (const vName in allVillageData) {
            if (allVillageData.hasOwnProperty(vName) && Array.isArray(allVillageData[vName])) {
                const familiesEnteredTodayInVillage = allVillageData[vName].filter(
                    family => family.entryDate && String(family.entryDate).startsWith(todayStr)
                );
                if (familiesEnteredTodayInVillage.length > 0) {
                    reportHTML += `<li><strong>ភូមិ ${vName}:</strong> ${familiesEnteredTodayInVillage.length} គ្រួសារ`;
                    entriesTodayCount += familiesEnteredTodayInVillage.length;
                }
            }
        }
        if (entriesTodayCount === 0) {
            reportHTML += '<li><em>មិនមានការបញ្ចូលទិន្នន័យថ្មីសម្រាប់ថ្ងៃនេះទេ។</em></li>';
        }
        reportHTML += '</ul>';
        dailyReportContentDiv.innerHTML = reportHTML;
    };
    if (generateDailyReportButton) {
        generateDailyReportButton.addEventListener('click', generateAndDisplayDailyReport);
        if(reportDateSpan) reportDateSpan.textContent = new Date().toLocaleDateString('km-KH', {day: '2-digit', month: 'long', year: 'numeric'});
    }

    const performAdminFamilySearch = () => {
        if (!searchFamilyInput) return;
        const searchTerm = searchFamilyInput.value;
        const selectedVillage = villageSelect.value;
        loadFamilyDataForSelectedVillageAdmin(selectedVillage, searchTerm);
    };
    if (searchFamilyButton) searchFamilyButton.addEventListener('click', performAdminFamilySearch);
    if (searchFamilyInput) {
        searchFamilyInput.addEventListener('keypress', e => { if (e.key === 'Enter') performAdminFamilySearch(); });
        searchFamilyInput.addEventListener('input', (e) => {
            if (e.target.value === '') {
                const selectedVillage = villageSelect.value;
                loadFamilyDataForSelectedVillageAdmin(selectedVillage);
            }
        });
    }

    const printCurrentVillageDataToPDF = () => {
        const villageToPrint = villageSelect.value;
        if (!villageToPrint) {
            alert("សូមជ្រើសរើសភូមិដើម្បីបោះពុម្ព។");
            return;
        }
        alert(`ការបោះពុម្ពទិន្នន័យសម្រាប់ភូមិ ${villageToPrint} មិនទាន់បានអនុវត្តនៅឡើយទេ។`);
    };
    if (printVillageDataButton) {
        printVillageDataButton.addEventListener('click', printCurrentVillageDataToPDF);
    }
    const checkAndShowPrintButton = (villageName) => {
        if (printVillageDataButton) {
            printVillageDataButton.style.display = villageName ? 'inline-block' : 'none';
        }
    };

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
    if (typeof calculateAdminSummary === 'function') calculateAdminSummary(); // Will now include migration stats
    if (typeof loadFamilyDataForSelectedVillageAdmin === 'function') loadFamilyDataForSelectedVillageAdmin(null);

});