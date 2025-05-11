// dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Determine User Type and Village to Display ---
    let currentUserType = sessionStorage.getItem('loggedInUserType');
    let villageChiefVillage = sessionStorage.getItem('loggedInVillage');
    let adminViewingVillage = sessionStorage.getItem('adminViewingVillage'); // For when admin views this dashboard
    let currentAdminUsername = sessionStorage.getItem('loggedInUsername');

    let villageToDisplay = '';
    let isAdminViewing = false;
    let villageChiefCanEdit = false;

    const VILLAGES_KEY = 'registeredVillages_v2';
    const getRegisteredVillages = () => {
        const villages = localStorage.getItem(VILLAGES_KEY);
        try {
            const parsed = JSON.parse(villages);
            return typeof parsed === 'object' && parsed !== null ? parsed : {};
        } catch (e) {
            console.error("Error parsing registered villages from localStorage", e);
            return {};
        }
    };

    if (currentUserType === 'admin' && adminViewingVillage) {
        villageToDisplay = adminViewingVillage;
        isAdminViewing = true;
    } else if (currentUserType === 'village' && villageChiefVillage) {
        villageToDisplay = villageChiefVillage;
        isAdminViewing = false;
        sessionStorage.removeItem('adminViewingVillage');

        const allRegisteredVillages = getRegisteredVillages();
        if (allRegisteredVillages[villageToDisplay]) {
            villageChiefCanEdit = allRegisteredVillages[villageToDisplay].canEditData === true;
        } else {
            villageChiefCanEdit = false; // Default if village info missing
        }
    } else {
        console.error("Invalid access state for dashboard. Redirecting.");
        alert('ការចូលប្រើមិនត្រឹមត្រូវ ឬព័ត៌មានបាត់! កំពុងត្រឡប់ទៅទំព័រ Login។');
        sessionStorage.clear();
        window.location.href = 'index.html';
        return;
    }

    // --- DOM References ---
    const dashboardTitle = document.getElementById('dashboard-title');
    const welcomeMessage = document.getElementById('welcome-message');
    const currentDateTimeDisplay = document.getElementById('current-date-time'); // For village chief's date/time
    const logoutButton = document.getElementById('logout-button');
    const backToAdminButton = document.getElementById('back-to-admin-button');
    const adminViewNotice = document.getElementById('admin-view-notice');
    const villageEditPermissionNotice = document.getElementById('village-edit-permission-notice');
    const dataInputSection = document.getElementById('data-input-section');
    const familyDataEntryForm = document.getElementById('family-data-entry-form');
    const familyHeadPhoneInput = document.getElementById('family-head-phone');
    const dataEntrySuccessMsg = document.getElementById('data-entry-success');
    const dataEntryErrorMsg = document.getElementById('data-entry-error');
    const familyListContainer = document.getElementById('family-list-container');
    const noFamilyDataMessage = document.getElementById('no-family-data-message');
    const familyCardTemplate = document.getElementById('family-card-template');
    const memberFieldsContainer = document.getElementById('member-fields-container');
    const addMemberButton = document.getElementById('add-member-button');
    const MAX_MEMBERS = 9;
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


    // --- Function to Display Current Date and Time in Khmer (Manual Formatting) ---
    const displayCurrentDateTimeInKhmer = () => {
        if (!currentDateTimeDisplay) {
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

        // *** ការកែប្រែដើម្បីបន្ថែមពណ៌ ***
        const timeString = `ម៉ោង ${hoursStr}:<span style="color: #28a745;">${minutes}</span>:<span style="color: #28a745;">${seconds}</span> ${ampm}`;
        // ឬពណ៌ខៀវ៖ const timeString = `ម៉ោង ${hoursStr}:<span style="color: #007bff;">${minutes}</span>:<span style="color: #007bff;">${seconds}</span> ${ampm}`;
        currentDateTimeDisplay.innerHTML = `ថ្ងៃ${dayName} ទី${dayOfMonth} ខែ${monthName} ឆ្នាំ${year} ${timeString}`;
        // *** បញ្ចប់ការកែប្រែដើម្បីបន្ថែមពណ៌ ***
    };

    // --- Call Time Display Function Immediately and Set Interval ---
    // Placed early to ensure it starts as soon as the element is available
    if (typeof displayCurrentDateTimeInKhmer === 'function') {
        displayCurrentDateTimeInKhmer();
        setInterval(displayCurrentDateTimeInKhmer, 1000);
    } else {
        console.error("Function displayCurrentDateTimeInKhmer is not defined in dashboard.js");
    }


    // --- Setup UI based on User Type ---
    if (dashboardTitle) dashboardTitle.textContent = `ផ្ទាំងគ្រប់គ្រងទិន្នន័យភូមិ ${villageToDisplay}`;
    if (welcomeMessage) {
        welcomeMessage.textContent = isAdminViewing
            ? `សូមស្វាគមន៍, ${currentAdminUsername || 'Admin'} (កំពុងមើលភូមិ ${villageToDisplay})`
            : `សូមស្វាគមន៍, មេភូមិ ${villageToDisplay}`;
    }
    if (currentVillageNameStats) currentVillageNameStats.textContent = villageToDisplay;
    if (currentVillageNameAssets) currentVillageNameAssets.textContent = villageToDisplay;

    if (isAdminViewing) {
        if (adminViewNotice) adminViewNotice.style.display = 'block';
        if (backToAdminButton) backToAdminButton.style.display = 'inline-block';
        if (dataInputSection) dataInputSection.style.display = 'none';
        if (villageEditPermissionNotice) villageEditPermissionNotice.style.display = 'none';
    } else { // Village Chief View
        if (adminViewNotice) adminViewNotice.style.display = 'none';
        if (backToAdminButton) backToAdminButton.style.display = 'none';
        if (dataInputSection) dataInputSection.style.display = 'block';
        if (familyDataEntryForm) familyDataEntryForm.style.display = 'none';
        if (toggleFormButton) toggleFormButton.textContent = 'បង្ហាញទម្រង់បញ្ចូលទិន្នន័យគ្រួសារថ្មី';
        if (villageEditPermissionNotice) {
            villageEditPermissionNotice.textContent = villageChiefCanEdit ? '✅ Admin បានអនុញ្ញាតឲ្យអ្នកកែសម្រួល និងលុបទិន្នន័យបាន។' : '❌ Admin មិនទាន់អនុញ្ញាតឲ្យអ្នកកែសម្រួល ឬលុបទិន្នន័យទេ។ សូមទាក់ទង Admin។';
            villageEditPermissionNotice.style.display = 'block';
        }
    }

    // --- LocalStorage Data Handling ---
    const VILLAGE_DATA_KEY = 'villageData_v2';
    const getVillageDataStorage = () => {
        const data = localStorage.getItem(VILLAGE_DATA_KEY);
        try { const parsed = JSON.parse(data); return typeof parsed === 'object' && parsed !== null ? parsed : {}; }
        catch (e) { console.error("Dashboard: Error parsing village data from localStorage", e); return {}; }
    };
    const saveVillageDataStorage = (data) => {
        if (typeof data === 'object' && data !== null) {
            localStorage.setItem(VILLAGE_DATA_KEY, JSON.stringify(data));
        } else {
            console.error("Dashboard: Attempted to save invalid data to villageData localStorage");
        }
    };

    // --- Asset and Member Field Definitions ---
    const assetFieldDefinitions = [
        {id: 'largeTrucks', label: 'រថយន្ដធំ', type: 'number'}, {id: 'smallCars', label: 'រថយន្តតូច', type: 'number'},
        {id: 'modifiedVehicles', label: 'រថយន្ដកែឆ្នៃ', type: 'number'}, {id: 'tractors', label: 'ត្រាក់ទ័រ', type: 'number'},
        {id: 'kubotas', label: 'គោយន្ដ', type: 'number'}, {id: 'riceHarvesters', label: 'ម៉ាស៊ីនច្រូតស្រូវ', type: 'number'},
        {id: 'riceMills', label: 'ម៉ាស៊ីនកិនស្រូវ', type: 'number'}, {id: 'waterPumpsWells', label: 'អណ្ដូងស្នប់', type: 'number'},
        {id: 'ponds', label: 'ស្រះទឹក', type: 'number'}, {id: 'residentialLandSize', label: 'ទំហំដីលំនៅដ្ឋាន', type: 'text', isLandArea: true},
        {id: 'paddyLandSize', label: 'ទំហំដីស្រែ', type: 'text', isLandArea: true},
        {id: 'plantationLandSize', label: 'ដីចំការ (ផ្សេងៗ)', type: 'text', isLandArea: true},
        {id: 'coconutLandSize', label: 'ដីចំការដូង', type: 'text', isLandArea: true},
        {id: 'mangoLandSize', label: 'ដីចំការស្វាយ', type: 'text', isLandArea: true},
        {id: 'cashewLandSize', label: 'ដីចំការស្វាយចន្ទី', type: 'text', isLandArea: true},
        {id: 'livestockLandSize', label: 'ដីចំការមាន', type: 'text', isLandArea: true},
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

    // --- Data Input Form (New Family) Logic ---
    if (toggleFormButton && !isAdminViewing) {
        toggleFormButton.addEventListener('click', () => {
            const isHidden = familyDataEntryForm.style.display === 'none';
            familyDataEntryForm.style.display = isHidden ? 'block' : 'none';
            toggleFormButton.textContent = isHidden ? 'លាក់ទម្រង់បញ្ចូលទិន្នន័យគ្រួសារថ្មី' : 'បង្ហាញទម្រង់បញ្ចូលទិន្នន័យគ្រួសារថ្មី';
        });
    }
    let newFamilyMemberCount = 1;
    if (addMemberButton && !isAdminViewing && memberFieldsContainer) {
        addMemberButton.addEventListener('click', () => {
            if (newFamilyMemberCount < MAX_MEMBERS) {
                newFamilyMemberCount++;
                const firstMemberEntry = memberFieldsContainer.querySelector('.member-entry');
                if (!firstMemberEntry) { console.error("Default member entry template for new form not found."); return; }
                const newMemberEntry = firstMemberEntry.cloneNode(true);
                newMemberEntry.dataset.memberIndex = newFamilyMemberCount - 1;
                const titleElement = newMemberEntry.querySelector('h4');
                if(titleElement) titleElement.textContent = `សមាជិកទី ${newFamilyMemberCount}`;
                newMemberEntry.querySelectorAll('input, select').forEach(input => {
                    if (input.type === 'checkbox' || input.type === 'radio') input.checked = false;
                    else if (input.tagName === 'SELECT') input.selectedIndex = 0;
                    else input.value = '';
                });
                memberFieldsContainer.appendChild(newMemberEntry);
                if (newFamilyMemberCount === MAX_MEMBERS) {
                    addMemberButton.disabled = true; addMemberButton.textContent = `បានដល់ចំនួនសមាជិកអតិបរមា (${MAX_MEMBERS})`;
                }
            }
        });
    }
    const resetNewFamilyFormMemberFields = () => {
        if (!memberFieldsContainer) return;
        while (memberFieldsContainer.children.length > 1) memberFieldsContainer.removeChild(memberFieldsContainer.lastChild);
        const firstMemberEntry = memberFieldsContainer.querySelector('.member-entry');
        if (firstMemberEntry) {
            firstMemberEntry.querySelectorAll('input, select').forEach(input => {
                if (input.type === 'checkbox' || input.type === 'radio') input.checked = false;
                else if (input.tagName === 'SELECT') input.selectedIndex = 0;
                else input.value = '';
            });
             const titleElement = firstMemberEntry.querySelector('h4');
             if(titleElement) titleElement.textContent = `សមាជិកទី 1`;
        }
        newFamilyMemberCount = 1;
        if (addMemberButton) { addMemberButton.disabled = false; addMemberButton.textContent = "បន្ថែមសមាជិកម្នាក់ទៀត"; }
    };

    // --- Display Village Asset Summary ---
    const displayVillageAssetSummary = (familiesInVillage) => {
        if (!villageAssetSummaryTbody) return;
        const assetTotals = {};
        assetFieldDefinitions.forEach(def => {
             if (def.type === 'number' || def.isLandArea) assetTotals[def.id] = 0;
        });
        familiesInVillage.forEach(family => {
            if (family.assets) {
                assetFieldDefinitions.forEach(def => {
                    const assetKey = def.id;
                    const assetValue = family.assets[assetKey];
                    if (assetTotals.hasOwnProperty(assetKey) && assetValue !== undefined && assetValue !== null) {
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
        villageAssetSummaryTbody.innerHTML = '';
        let hasAnyAssetsData = false;
        assetFieldDefinitions.forEach(def => {
            const row = villageAssetSummaryTbody.insertRow();
            row.insertCell().textContent = def.label;
            const totalCell = row.insertCell();
            if (assetTotals.hasOwnProperty(def.id)) {
                const totalValue = assetTotals[def.id];
                if (totalValue > 0 || (def.isLandArea && totalValue !== undefined)) hasAnyAssetsData = true;

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
         if (!hasAnyAssetsData && familiesInVillage.length > 0) {
             villageAssetSummaryTbody.innerHTML = '<tr><td colspan="2"><em>មិនមានទិន្នន័យទ្រព្យសម្បត្តិសម្រាប់គណនា។</em></td></tr>';
         } else if (familiesInVillage.length === 0) {
             villageAssetSummaryTbody.innerHTML = '<tr><td colspan="2"><em>មិនមានទិន្នន័យគ្រួសារដើម្បីគណនា។</em></td></tr>';
         }
    };

    // --- Render Single Family Card ---
    const renderSingleFamilyCard = (family, containerElement, currentVillageForActions) => {
         if (!familyCardTemplate) { console.error("Family card template not found!"); return; }
         const cardClone = familyCardTemplate.content.cloneNode(true);
         const familyCard = cardClone.querySelector('.family-card');
         if (!familyCard) { console.error("Family card element not found in template!"); return;}

         familyCard.dataset.familyId = family.familyId;
         const cardNameEl = familyCard.querySelector('.family-card-name');
         if(cardNameEl) cardNameEl.textContent = family.familyName || 'N/A';

         const cardPhoneEl = familyCard.querySelector('.family-card-phone');
         if (cardPhoneEl) {
             cardPhoneEl.textContent = family.headOfHouseholdPhone ? `ទូរស័ព្ទ: ${family.headOfHouseholdPhone}` : '';
             cardPhoneEl.style.display = family.headOfHouseholdPhone ? 'block' : 'none';
         }

         const cardDateEl = familyCard.querySelector('.family-card-entry-date');
         if(cardDateEl) {
             try {
                 cardDateEl.textContent = `កាលបរិច្ឆេទបញ្ចូល: ${new Date(family.entryDate).toLocaleDateString('km-KH', { day: '2-digit', month: 'short', year: 'numeric' })}`;
             } catch (e) {
                 cardDateEl.textContent = `កាលបរិច្ឆេទបញ្ចូល: មិនត្រឹមត្រូវ`;
             }
         }

         const membersTableBody = familyCard.querySelector('.members-table tbody');
         let familyMemberCount = 0;
         if (family.members && Array.isArray(family.members) && membersTableBody) {
             familyMemberCount = family.members.length;
             membersTableBody.innerHTML = '';
             if (familyMemberCount > 0) {
                family.members.forEach(member => {
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
         if(memberCountEl) memberCountEl.textContent = familyMemberCount;

         const assetsDiv = familyCard.querySelector('.assets-details');
         if (assetsDiv) {
             assetsDiv.innerHTML = '';
             let hasReportedAssetsInCard = false;
             if (family.assets) {
                 assetFieldDefinitions.forEach(def => {
                     const assetValue = family.assets[def.id];
                     if (assetValue !== undefined && assetValue !== null && String(assetValue).trim() !== "" && String(assetValue).trim() !== "0") {
                         const p = document.createElement('p');
                         p.innerHTML = `<strong>${def.label}:</strong> ${assetValue}`;
                         assetsDiv.appendChild(p);
                         hasReportedAssetsInCard = true;
                     }
                 });
             }
             if (!hasReportedAssetsInCard) {
                 assetsDiv.innerHTML = '<p><em>មិនមានទ្រព្យសម្បត្តិ/អាជីវកម្មដែលបានរាយការណ៍។</em></p>';
             }
         }

         const actionsDiv = familyCard.querySelector('.family-card-actions');
         if (actionsDiv) {
            if (isAdminViewing || (!isAdminViewing && villageChiefCanEdit)) {
                 actionsDiv.style.display = 'block';
                 const editBtn = actionsDiv.querySelector('.edit-family-button');
                 const deleteBtn = actionsDiv.querySelector('.delete-family-button');
                 if (editBtn) editBtn.onclick = () => openEditFamilyModal(currentVillageForActions, family.familyId, family);
                 if (deleteBtn) deleteBtn.onclick = () => deleteFamilyData(currentVillageForActions, family.familyId);
             } else {
                 actionsDiv.style.display = 'none';
             }
         }
         containerElement.appendChild(cardClone);
    };

    // --- Load Village Family Data (from localStorage) ---
    const loadVillageFamilyData = (searchTerm = '') => {
        if (!familyListContainer || !familyCardTemplate) return;
        if (searchVillageInput && !searchTerm) searchVillageInput.value = '';

        const allVillageData = getVillageDataStorage();
        let familiesInVillage = (allVillageData.hasOwnProperty(villageToDisplay) && Array.isArray(allVillageData[villageToDisplay]))
                                ? [...allVillageData[villageToDisplay]]
                                : [];
        if(familyListContainer) familyListContainer.innerHTML = '';
        const searchTermLower = searchTerm.trim().toLowerCase();
        let familiesToDisplay = familiesInVillage;

        if (searchTermLower) {
            familiesToDisplay = familiesInVillage.filter(family => {
                let match = false;
                if (family.familyName && family.familyName.toLowerCase().includes(searchTermLower)) match = true;
                if (!match && family.members && Array.isArray(family.members)) {
                    for (const mem of family.members) {
                        if ((mem.name && mem.name.toLowerCase().includes(searchTermLower)) || (mem.nationalId && mem.nationalId.includes(searchTermLower))) {
                            match = true; break;
                        }
                    }
                } return match;
            });
        }

        if (familiesToDisplay.length > 0) {
            if(noFamilyDataMessage) noFamilyDataMessage.style.display = 'none';
            familiesToDisplay.sort((a, b) => new Date(b.entryDate) - new Date(a.entryDate));
            familiesToDisplay.forEach(family => {
                renderSingleFamilyCard(family, familyListContainer, villageToDisplay);
            });
        } else {
             if(noFamilyDataMessage) {
                 noFamilyDataMessage.textContent = searchTermLower
                    ? `រកមិនឃើញលទ្ធផលសម្រាប់ "${searchTerm}" ក្នុងភូមិ ${villageToDisplay} ទេ។`
                    : `មិនទាន់មានទិន្នន័យគ្រួសារសម្រាប់ភូមិ ${villageToDisplay} ទេ។`;
                 noFamilyDataMessage.style.display = 'block';
             }
        }

        let totalPeople = 0;
        let totalFemales = 0;
        let todayEntriesCount = 0;
        let totalInternalMigrants = 0;
        let totalExternalMigrants = 0;
        const todayDateString = new Date().toISOString().split('T')[0];

        const fullDataForStats = (allVillageData.hasOwnProperty(villageToDisplay) && Array.isArray(allVillageData[villageToDisplay]))
                                ? allVillageData[villageToDisplay] : [];

        fullDataForStats.forEach(family => {
            if (family.members && Array.isArray(family.members)) {
                totalPeople += family.members.length;
                family.members.forEach(member => {
                    if (member.gender === 'ស្រី') totalFemales++;
                    if (member.internalMigration === 'បាទ') totalInternalMigrants++;
                    if (member.externalMigration === 'បាទ') totalExternalMigrants++;
                });
            }
            if (family.entryDate && typeof family.entryDate === 'string' && family.entryDate.startsWith(todayDateString)) {
                todayEntriesCount++;
            }
        });

        if(totalFamiliesVillageSpan) totalFamiliesVillageSpan.textContent = fullDataForStats.length;
        if(totalPeopleVillageSpan) totalPeopleVillageSpan.textContent = totalPeople;
        if(totalFemalesVillageSpan) totalFemalesVillageSpan.textContent = totalFemales;
        if(todayEntriesVillageSpan) todayEntriesVillageSpan.textContent = todayEntriesCount;
        if(totalInternalMigrantsVillageSpan) totalInternalMigrantsVillageSpan.textContent = totalInternalMigrants;
        if(totalExternalMigrantsVillageSpan) totalExternalMigrantsVillageSpan.textContent = totalExternalMigrants;

        displayVillageAssetSummary(fullDataForStats);
    };

    // --- New Family Data Entry Form Submission ---
    if (familyDataEntryForm && !isAdminViewing) {
        familyDataEntryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if(dataEntrySuccessMsg) dataEntrySuccessMsg.textContent = '';
            if(dataEntryErrorMsg) dataEntryErrorMsg.textContent = '';
            const familyHeadNameValue = document.getElementById('family-head-name').value.trim();
            const headOfHouseholdPhoneValue = familyHeadPhoneInput ? familyHeadPhoneInput.value.trim() : "";

            if (!familyHeadNameValue) { if(dataEntryErrorMsg) dataEntryErrorMsg.textContent = 'សូមបញ្ចូលឈ្មោះមេគ្រួសារ។'; return; }

            const newFamilyData = {
                familyId: `fam_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                familyName: familyHeadNameValue,
                headOfHouseholdPhone: headOfHouseholdPhoneValue,
                entryDate: new Date().toISOString(),
                members: [], assets: {}
            };

            const memberEntries = memberFieldsContainer.querySelectorAll('.member-entry');
            let hasAtLeastOneValidMember = false;
            memberEntries.forEach(entry => {
                const name = entry.querySelector('.member-name')?.value.trim();
                if (name) {
                    hasAtLeastOneValidMember = true;
                    newFamilyData.members.push({
                        id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                        name: name,
                        gender: entry.querySelector('.member-gender')?.value || 'ប្រុស',
                        dob: entry.querySelector('.member-dob')?.value || null,
                        birthProvince: entry.querySelector('.member-birthProvince')?.value.trim() || null,
                        educationLevel: entry.querySelector('.member-educationLevel')?.value.trim() || null,
                        occupation: entry.querySelector('.member-occupation')?.value.trim() || null,
                        nationalId: entry.querySelector('.member-nationalId')?.value.trim() || null,
                        electionOfficeId: entry.querySelector('.member-electionOfficeId')?.value.trim() || null,
                        internalMigration: entry.querySelector('.member-internalMigration')?.value || 'ទេ',
                        externalMigration: entry.querySelector('.member-externalMigration')?.value || 'ទេ',
                    });
                }
            });

            if (!hasAtLeastOneValidMember && newFamilyData.members.length === 0) {
                 if(dataEntryErrorMsg) dataEntryErrorMsg.textContent = 'សូមបញ្ចូលព័ត៌មានសម្រាប់សមាជិកគ្រួសារយ៉ាងតិចម្នាក់ (ត្រូវមានឈ្មោះ)។';
                 return;
            }

            const assetInputs = familyDataEntryForm.querySelectorAll('.asset-grid input');
            assetInputs.forEach(input => {
                const value = input.type === 'number'
                    ? (parseInt(input.value, 10) || 0)
                    : (input.value.trim() || (input.id.toLowerCase().includes('landsize') ? "0" : ""));
                newFamilyData.assets[input.id] = value;
            });

            const allVillageData = getVillageDataStorage();
            if (!allVillageData.hasOwnProperty(villageToDisplay) || !Array.isArray(allVillageData[villageToDisplay])) {
                allVillageData[villageToDisplay] = [];
            }
            allVillageData[villageToDisplay].push(newFamilyData);
            saveVillageDataStorage(allVillageData);

            if(dataEntrySuccessMsg) dataEntrySuccessMsg.textContent = 'ទិន្នន័យគ្រួសារត្រូវបានបញ្ចូលដោយជោគជ័យ!';
            familyDataEntryForm.reset();
            resetNewFamilyFormMemberFields();
            loadVillageFamilyData();
            setTimeout(() => { if(dataEntrySuccessMsg) dataEntrySuccessMsg.textContent = ''; }, 4000);
        });
    }

    // --- Search Logic ---
    const performVillageSearch = () => {
        if (!searchVillageInput) return;
        const searchTerm = searchVillageInput.value;
        loadVillageFamilyData(searchTerm);
    };
    if (searchVillageButton) searchVillageButton.addEventListener('click', performVillageSearch);
    if (searchVillageInput) {
        searchVillageInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') performVillageSearch(); });
        searchVillageInput.addEventListener('input', (e) => {
            if (e.target.value === '') {
                loadVillageFamilyData();
            }
        });
    }

    // --- Edit Family Modal Logic ---
    const openEditFamilyModal = (villageNameContext, familyId, familyData) => {
         if (!isAdminViewing && !villageChiefCanEdit) { alert("អ្នកមិនមានសិទ្ធិកែសម្រួលទិន្នន័យនេះទេ។"); return; }
         if (!editFamilyModal || !editFamilyIdInput || !editFamilyVillageInput || !editFamilyHeadNameInput || !editFamilyMembersContainer || !editFamilyAssetsContainer || !editMemberTemplateAdmin) {
             console.error("One or more edit modal elements are missing from the DOM."); return;
         }
         editFamilyIdInput.value = familyId;
         editFamilyVillageInput.value = villageNameContext;
         editFamilyHeadNameInput.value = familyData.familyName || "";
         if (editFamilyHeadPhoneAdminInput) editFamilyHeadPhoneAdminInput.value = familyData.headOfHouseholdPhone || "";

         editFamilyMembersContainer.innerHTML = '';
         if (familyData.members && Array.isArray(familyData.members)) {
             familyData.members.forEach((member, index) => {
                 const memberClone = editMemberTemplateAdmin.content.cloneNode(true);
                 const memberEntry = memberClone.querySelector('.member-entry');
                 if (!memberEntry) return;

                 const originalIdInput = memberEntry.querySelector('.member-original-id-edit');
                 if (originalIdInput) originalIdInput.value = member.id || `temp_id_${index}`;

                 const titleElement = memberEntry.querySelector('h4');
                 if (titleElement) {
                     titleElement.innerHTML = `សមាជិកទី ${index + 1} (កែសម្រួល) <button type="button" class="remove-member-edit-button" title="ដកសមាជិកនេះចេញ">×</button>`;
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
                                catch (e) { inputEl.value = valueFromData; }
                            } else {
                                inputEl.value = valueFromData;
                            }
                         } else {
                             if (inputEl.tagName === 'SELECT' && def.options && def.options.length > 0) inputEl.value = def.options[0].value;
                             else inputEl.value = '';
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
             label.htmlFor = `edit-${fieldDef.id}`; label.textContent = fieldDef.label + ':';
             const input = document.createElement('input');
             input.type = fieldDef.type; input.id = `edit-${fieldDef.id}`; input.name = fieldDef.id;
             const existingValue = (familyData.assets && familyData.assets[fieldDef.id] !== undefined)
                ? familyData.assets[fieldDef.id]
                : (input.type === 'number' ? '0' : (fieldDef.isLandArea ? "0" : ""));
             input.value = existingValue;
             if(input.type === 'number') input.min = "0";
             if(input.type === 'text' && (input.value === '0' || input.value === '') && fieldDef.id.toLowerCase().includes('landsize')) {
                 input.placeholder = "0";
                 input.value = "";
             }
             div.appendChild(label); div.appendChild(input);
             editFamilyAssetsContainer.appendChild(div);
         });

         if(editFamilyErrorAdmin) editFamilyErrorAdmin.textContent = '';
         if(editFamilySuccessAdmin) editFamilySuccessAdmin.textContent = '';
         editFamilyModal.style.display = 'block';
    };

    const MAX_MEMBERS_EDIT = 9;
    if(addMemberToEditFormButton && editMemberTemplateAdmin) {
         addMemberToEditFormButton.onclick = () => {
             if (!isAdminViewing && !villageChiefCanEdit) return;
             if (editFamilyMembersContainer.children.length < MAX_MEMBERS_EDIT) {
                 const memberClone = editMemberTemplateAdmin.content.cloneNode(true);
                 const memberEntry = memberClone.querySelector('.member-entry'); if(!memberEntry) return;
                 const originalIdInput = memberEntry.querySelector('.member-original-id-edit');
                 if (originalIdInput) originalIdInput.value = `new_${Date.now()}`;
                 const titleElement = memberEntry.querySelector('h4');
                 if(titleElement) {
                     titleElement.innerHTML = `សមាជិកថ្មី (កែសម្រួល) <button type="button" class="remove-member-edit-button" title="ដកសមាជិកនេះចេញ">×</button>`;
                     const removeBtn = titleElement.querySelector('.remove-member-edit-button');
                     if(removeBtn) removeBtn.onclick = (e) => {e.preventDefault(); memberEntry.remove();};
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
             if (!isAdminViewing && !villageChiefCanEdit) {
                 if(editFamilyErrorAdmin) editFamilyErrorAdmin.textContent = "អ្នកមិនមានសិទ្ធិរក្សាទុកការផ្លាស់ប្តូរទេ។";
                 return;
             }
             if(editFamilyErrorAdmin) editFamilyErrorAdmin.textContent = '';
             if(editFamilySuccessAdmin) editFamilySuccessAdmin.textContent = '';

             const familyIdToUpdate = editFamilyIdInput.value;
             const villageOfFamily = editFamilyVillageInput.value;
             const updatedFamilyHeadNameValue = editFamilyHeadNameInput.value.trim();
             const updatedHeadPhoneValue = editFamilyHeadPhoneAdminInput ? editFamilyHeadPhoneAdminInput.value.trim() : "";

             if (!updatedFamilyHeadNameValue) {
                 if(editFamilyErrorAdmin) editFamilyErrorAdmin.textContent = "ឈ្មោះមេគ្រួសារមិនអាចនៅទទេបានទេ។";
                 return;
             }

             const updatedFamilyPayload = {
                 familyId: familyIdToUpdate,
                 familyName: updatedFamilyHeadNameValue,
                 headOfHouseholdPhone: updatedHeadPhoneValue,
                 members: [],
                 assets: {},
                 lastModifiedBy: isAdminViewing ? (currentAdminUsername || 'Admin') : villageToDisplay,
                 lastModifiedDate: new Date().toISOString()
             };

             const memberEditEntries = editFamilyMembersContainer.querySelectorAll('.member-entry');
             memberEditEntries.forEach(entry => {
                 const nameInput = entry.querySelector('.member-name-edit');
                 const name = nameInput ? nameInput.value.trim() : '';
                 if (name) {
                     const memberObj = {
                         id: entry.querySelector('.member-original-id-edit')?.value || ''
                     };
                     if (memberObj.id.startsWith('new_')) {
                        memberObj.id = `mem_${Date.now()}_${Math.random().toString(36).substr(2,5)}`;
                     }
                     memberFieldDefinitionsForEdit.forEach(def => {
                         const inputEl = entry.querySelector(`.${def.classSuffix}`);
                         if (inputEl) {
                            memberObj[def.prop] = inputEl.value.trim() || (inputEl.tagName === 'SELECT' && def.options && def.options.length > 0 ? def.options[0].value : '');
                         }
                     });
                     updatedFamilyPayload.members.push(memberObj);
                 }
             });

            const assetEditInputs = editFamilyAssetsContainer.querySelectorAll('input[name]');
            assetEditInputs.forEach(input => {
                const assetKey = input.name;
                if (assetKey) {
                    updatedFamilyPayload.assets[assetKey] = input.type === 'number'
                        ? (parseInt(input.value, 10) || 0)
                        : (input.value.trim() || (input.id.toLowerCase().includes('landsize') ? "0" : ""));
                }
            });

             const allData = getVillageDataStorage();
             if (allData.hasOwnProperty(villageOfFamily) && Array.isArray(allData[villageOfFamily])) {
                 const familyIndex = allData[villageOfFamily].findIndex(f => f.familyId === familyIdToUpdate);
                 if (familyIndex > -1) {
                     updatedFamilyPayload.entryDate = allData[villageOfFamily][familyIndex].entryDate;
                     allData[villageOfFamily][familyIndex] = updatedFamilyPayload;
                     saveVillageDataStorage(allData);
                     if(editFamilySuccessAdmin) editFamilySuccessAdmin.textContent = 'ទិន្នន័យគ្រួសារបានកែសម្រួលជោគជ័យ!';
                     loadVillageFamilyData();
                     setTimeout(() => {
                         if(editFamilyModal) editFamilyModal.style.display = 'none';
                         if(editFamilySuccessAdmin) editFamilySuccessAdmin.textContent = '';
                     }, 2000);
                 } else {
                     if(editFamilyErrorAdmin) editFamilyErrorAdmin.textContent = 'រកមិនឃើញទិន្នន័យគ្រួសារដើមដើម្បីកែសម្រួល។';
                 }
             } else {
                 if(editFamilyErrorAdmin) editFamilyErrorAdmin.textContent = 'មានបញ្ហាក្នុងការទាញយកទិន្នន័យភូមិ។';
             }
         });
    }

    // --- Delete Family Data ---
    const deleteFamilyData = (villageNameContext, familyIdToDelete) => {
         if (!isAdminViewing && !villageChiefCanEdit) { alert("អ្នកមិនមានសិទ្ធិលុបទិន្នន័យនេះទេ។"); return; }
         const allVillageData = getVillageDataStorage();
         const familyDataForDeletion = allVillageData[villageNameContext]?.find(f => f.familyId === familyIdToDelete);
         const familyNameToConfirm = familyDataForDeletion?.familyName || `ID ${familyIdToDelete}`;

         if (!confirm(`តើអ្នកពិតជាចង់លុបទិន្នន័យគ្រួសារ "${familyNameToConfirm}" ក្នុងភូមិ "${villageNameContext}" មែនទេ?`)) return;

         if (allVillageData.hasOwnProperty(villageNameContext) && Array.isArray(allVillageData[villageNameContext])) {
             const initialLength = allVillageData[villageNameContext].length;
             allVillageData[villageNameContext] = allVillageData[villageNameContext].filter(family => family.familyId !== familyIdToDelete);
             if (allVillageData[villageNameContext].length < initialLength) {
                 saveVillageDataStorage(allVillageData);
                 loadVillageFamilyData();
                 alert(`ទិន្នន័យគ្រួសារ "${familyNameToConfirm}" ត្រូវបានលុប។`);
             } else {
                 alert('រកមិនឃើញទិន្នន័យគ្រួសារដែលត្រូវលុប។');
             }
         } else {
             alert('មានបញ្ហាក្នុងការទាញយកទិន្នន័យភូមិដើម្បីលុប។');
         }
    };

    // --- Event Listeners for Logout and Back to Admin ---
    if (backToAdminButton) {
        backToAdminButton.addEventListener('click', () => {
            sessionStorage.removeItem('adminViewingVillage');
            window.location.href = 'admin_dashboard.html';
        });
    }
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            sessionStorage.clear();
            window.location.href = 'index.html';
        });
    }

    // --- Initial Calls ---
    loadVillageFamilyData(); // Load family data for the current village
    // The time display and interval are already set up near the top of DOMContentLoaded
});