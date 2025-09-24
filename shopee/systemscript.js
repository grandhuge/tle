        // Global variables
        let selectedFiles = [];
        let uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
        let isAdmin = false;

        // Add sample data for testing if no data exists
        if (uploadedFiles.length === 0) {
            uploadedFiles = [
                {
                    id: '1',
                    orderNumber: 'ORD001',
                    fileName: 'ORD001_document.pdf',
                    size: 1024000,
                    mimeType: 'application/pdf',
                    uploadTime: '2024-01-15 10:30:00',
                    driveUrl: 'https://drive.google.com/file/d/1example1/view',
                    driveFileId: '1example1'
                },
                {
                    id: '2',
                    orderNumber: 'ORD001',
                    fileName: 'ORD001_image.jpg',
                    size: 2048000,
                    mimeType: 'image/jpeg',
                    uploadTime: '2024-01-15 10:31:00',
                    driveUrl: 'https://drive.google.com/file/d/1example2/view',
                    driveFileId: '1example2'
                },
                {
                    id: '3',
                    orderNumber: 'ORD002',
                    fileName: 'ORD002_presentation.pptx',
                    size: 5120000,
                    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                    uploadTime: '2024-01-16 14:20:00',
                    driveUrl: 'https://drive.google.com/file/d/1example3/view',
                    driveFileId: '1example3'
                }
            ];
            localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            setupFileUpload();
            checkAndCleanOldFiles();
            if (uploadedFiles.length > 0) {
                displayAdminFiles();
            }
        });

        // Check order number and display existing files
        function checkOrderNumber() {
            const orderNumber = document.getElementById('orderNumber').value.trim();
            const existingFilesDiv = document.getElementById('existingFiles');
            const existingFilesList = document.getElementById('existingFilesList');
            
            if (orderNumber.length < 3) {
                existingFilesDiv.classList.add('hidden');
                return;
            }
            
            // Find files matching the order number
            const matchingFiles = uploadedFiles.filter(file => 
                file.orderNumber && file.orderNumber.toLowerCase().includes(orderNumber.toLowerCase())
            );
            
            if (matchingFiles.length > 0) {
                existingFilesDiv.classList.remove('hidden');
                displayExistingFiles(matchingFiles);
            } else {
                existingFilesDiv.classList.add('hidden');
            }
        }

        // Display existing files for the order number
        function displayExistingFiles(files) {
            const container = document.getElementById('existingFilesList');
            container.innerHTML = '';
            
            // Group files by exact order number
            const groupedFiles = {};
            files.forEach(file => {
                if (!groupedFiles[file.orderNumber]) {
                    groupedFiles[file.orderNumber] = [];
                }
                groupedFiles[file.orderNumber].push(file);
            });
            
            Object.keys(groupedFiles).forEach(orderNumber => {
                const orderFiles = groupedFiles[orderNumber];
                
                orderFiles.forEach(file => {
                    const fileDiv = document.createElement('div');
                    fileDiv.className = 'bg-white p-4 rounded-lg border border-blue-200 shadow-sm';
                    
                    const fileIcon = getFileIcon(file.mimeType || 'application/octet-stream');
                    
                    fileDiv.innerHTML = `
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <div class="w-10 h-10 ${fileIcon.bg} rounded-lg flex items-center justify-center">
                                    ${fileIcon.svg}
                                </div>
                                <div>
                                    <p class="font-medium text-gray-800">${file.fileName}</p>
                                    <p class="text-sm text-gray-500">อัปโหลดเมื่อ: ${file.uploadTime || 'ไม่ระบุ'}</p>
                                    <p class="text-xs text-gray-400">${formatFileSize(file.size || 0)}</p>
                                </div>
                            </div>
                            <div class="flex items-center space-x-2">
                                ${file.driveUrl ? `
                                    <a href="${file.driveUrl}" target="_blank" rel="noopener noreferrer" 
                                       class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-1">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-1a1 1 0 10-2 0v1H5V7h1a1 1 0 000-2H5z"/>
                                        </svg>
                                        <span>เปิดดู</span>
                                    </a>
                                ` : `
                                    <span class="text-gray-400 text-sm">ไม่มีลิ้งก์</span>
                                `}
                            </div>
                        </div>
                    `;
                    
                    container.appendChild(fileDiv);
                });
            });
        }

        // Check and clean old files (30+ days)
        function checkAndCleanOldFiles() {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            const oldFiles = uploadedFiles.filter(file => {
                const uploadDate = new Date(file.uploadTime);
                return uploadDate < thirtyDaysAgo;
            });
            
            if (oldFiles.length > 0) {
                // Remove old files from local storage
                uploadedFiles = uploadedFiles.filter(file => {
                    const uploadDate = new Date(file.uploadTime);
                    return uploadDate >= thirtyDaysAgo;
                });
                
                localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
                
                // In a real implementation, this would also delete files from Google Drive
                console.log(`Cleaned ${oldFiles.length} old files (30+ days)`);
                
                if (isAdmin) {
                    showAlert(`ระบบได้ลบไฟล์เก่า ${oldFiles.length} ไฟล์ที่มีอายุเกิน 30 วันแล้ว`, 'info');
                }
            }
        }

        // File upload setup
        function setupFileUpload() {
            const dropZone = document.getElementById('dropZone');
            const fileInput = document.getElementById('fileInput');

            dropZone.addEventListener('click', () => fileInput.click());
            
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('dragover');
            });

            dropZone.addEventListener('dragleave', () => {
                dropZone.classList.remove('dragover');
            });

            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('dragover');
                handleFiles(e.dataTransfer.files);
            });

            fileInput.addEventListener('change', (e) => {
                handleFiles(e.target.files);
            });
        }

        // Handle file selection
        function handleFiles(files) {
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 
                                'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                                'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

            for (let file of files) {
                if (selectedFiles.length >= 5) {
                    showMessage('สามารถอัปโหลดได้สูงสุด 5 ไฟล์เท่านั้น', 'error');
                    break;
                }

                if (!allowedTypes.includes(file.type)) {
                    showMessage(`ไฟล์ ${file.name} ไม่รองรับ`, 'error');
                    continue;
                }

                if (file.size > 10 * 1024 * 1024) { // 10MB limit
                    showMessage(`ไฟล์ ${file.name} มีขนาดใหญ่เกินไป (สูงสุด 10MB)`, 'error');
                    continue;
                }

                selectedFiles.push(file);
            }

            displaySelectedFiles();
        }

        // Display selected files
        function displaySelectedFiles() {
            const container = document.getElementById('selectedFiles');
            container.innerHTML = '';

            if (selectedFiles.length > 0) {
                const headerDiv = document.createElement('div');
                headerDiv.className = 'bg-blue-50 rounded-xl p-4 mb-3';
                headerDiv.innerHTML = `
                    <h3 class="text-lg font-semibold text-gray-800 mb-2">
                        <svg class="w-5 h-5 inline mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                            <path fill-rule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6.5a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 016 11.5V5z" clip-rule="evenodd"/>
                        </svg>
                        ไฟล์ที่เลือก (${selectedFiles.length}/5)
                    </h3>
                `;
                container.appendChild(headerDiv);
            }

            selectedFiles.forEach((file, index) => {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-all';
                
                const fileIcon = getFileIcon(file.type);
                
                fileItem.innerHTML = `
                    <div class="flex items-center space-x-4">
                        <div class="w-12 h-12 ${fileIcon.bg} rounded-xl flex items-center justify-center">
                            ${fileIcon.svg}
                        </div>
                        <div>
                            <p class="font-semibold text-gray-800">${file.name}</p>
                            <p class="text-sm text-gray-500">${formatFileSize(file.size)}</p>
                        </div>
                    </div>
                    <button onclick="removeFile(${index})" class="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                        </svg>
                    </button>
                `;
                container.appendChild(fileItem);
            });
        }

        // Get file icon based on type
        function getFileIcon(type) {
            if (type.includes('pdf')) {
                return {
                    bg: 'bg-red-100',
                    svg: '<svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"/></svg>'
                };
            } else if (type.includes('image')) {
                return {
                    bg: 'bg-green-100',
                    svg: '<svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/></svg>'
                };
            } else if (type.includes('word')) {
                return {
                    bg: 'bg-blue-100',
                    svg: '<svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"/></svg>'
                };
            } else if (type.includes('excel') || type.includes('sheet')) {
                return {
                    bg: 'bg-emerald-100',
                    svg: '<svg class="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"/></svg>'
                };
            } else {
                return {
                    bg: 'bg-gray-100',
                    svg: '<svg class="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"/></svg>'
                };
            }
        }

        // Remove file
        function removeFile(index) {
            selectedFiles.splice(index, 1);
            displaySelectedFiles();
        }

        // Format file size
        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        // Handle form submission
        document.getElementById('uploadForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const orderNumber = document.getElementById('orderNumber').value.trim();
            
            if (!orderNumber) {
                showMessage('กรุณากรอกหมายเลขคำสั่งซื้อ', 'error');
                return;
            }

            if (selectedFiles.length === 0) {
                showMessage('กรุณาเลือกไฟล์อย่างน้อย 1 ไฟล์', 'error');
                return;
            }

            uploadFiles(orderNumber);
        });

        // Upload files to Google Apps Script
        async function uploadFiles(orderNumber) {
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg class="w-5 h-5 inline mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                กำลังอัปโหลด...
            `;

            try {
                const uploadPromises = selectedFiles.map(async (file, index) => {
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            const base64Data = e.target.result.split(',')[1];
                            const fileExtension = file.name.split('.').pop();
                            const newFileName = `${orderNumber}_${file.name}`;
                            
                            resolve({
                                fileName: newFileName,
                                originalName: file.name,
                                mimeType: file.type,
                                data: base64Data,
                                size: file.size,
                                orderNumber: orderNumber
                            });
                        };
                        reader.onerror = reject;
                        reader.readAsDataURL(file);
                    });
                });

                const fileData = await Promise.all(uploadPromises);
                
                // Send to Google Apps Script
                const response = await fetch('https://script.google.com/macros/s/AKfycbw3zVO-jxkz7RxeqngBk7kv7zClNlg-YphwLVu6vkC4bcvm9L0uErQKkn0NqBcZGthW/exec', {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        action: 'uploadFiles',
                        files: fileData
                    })
                });

                // In real implementation, these URLs would come from the Google Apps Script response
                // For now, we'll simulate the response structure that matches the database
                const uploadedFileLinks = fileData.map((file, index) => {
                    // Generate a sample file ID (in real app, this comes from Google Drive API)
                    const sampleFileId = `1${Math.random().toString(36).substr(2, 32)}`;
                    const fileId = Date.now().toString() + index;
                    
                    // Add to uploadedFiles array for admin management
                    const newFile = {
                        id: fileId,
                        orderNumber: orderNumber,
                        fileName: file.fileName,
                        size: file.size,
                        mimeType: file.mimeType,
                        uploadTime: new Date().toLocaleString('th-TH', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            timeZone: 'Asia/Bangkok'
                        }),
                        driveUrl: `https://drive.google.com/file/d/${sampleFileId}/view`,
                        driveFileId: sampleFileId
                    };
                    
                    uploadedFiles.push(newFile);
                    
                    return {
                        name: file.fileName,
                        url: `https://drive.google.com/file/d/${sampleFileId}/view`,
                        driveFileId: sampleFileId
                    };
                });

                // Save updated files to localStorage
                localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));

                showSuccessModal(orderNumber, uploadedFileLinks);
                
                // Reset form
                document.getElementById('uploadForm').reset();
                selectedFiles = [];
                displaySelectedFiles();
                
                // Refresh admin files if admin is logged in
                if (isAdmin) {
                    await loadAdminFiles();
                }
                
            } catch (error) {
                console.error('Upload error:', error);
                showAlert('เกิดข้อผิดพลาดในการอัปโหลดไฟล์', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `
                    <svg class="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                    </svg>
                    ส่งไฟล์เลย
                `;
            }
        }

        // Show success modal with file links
        function showSuccessModal(orderNumber, fileLinks) {
            const modal = document.getElementById('successModal');
            const message = document.getElementById('successMessage');
            const linksContainer = document.getElementById('fileLinks');
            
            // Get current time in Thai format
            const now = new Date();
            const thaiTime = now.toLocaleString('th-TH', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZone: 'Asia/Bangkok'
            });
            
            message.innerHTML = `
                <div class="text-center">
                    <p class="font-semibold">หมายเลขคำสั่งซื้อ: ${orderNumber}</p>
                    <p class="text-sm text-gray-600 mt-1">อัปโหลดสำเร็จเมื่อ: ${thaiTime}</p>
                </div>
            `;
            
            linksContainer.innerHTML = '';
            fileLinks.forEach(file => {
                const linkDiv = document.createElement('div');
                linkDiv.className = 'bg-blue-50 p-3 rounded-lg';
                linkDiv.innerHTML = `
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-medium text-gray-700">${file.name}</span>
                        <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                    </div>
                `;
                linksContainer.appendChild(linkDiv);
            });
            
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }

        // Close success modal
        function closeSuccessModal() {
            const modal = document.getElementById('successModal');
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }

        // Show confirmation modal
        function showConfirmModal(title, message, onConfirm) {
            const modal = document.getElementById('confirmModal');
            document.getElementById('confirmTitle').textContent = title;
            document.getElementById('confirmMessage').textContent = message;
            
            const confirmBtn = document.getElementById('confirmButton');
            confirmBtn.onclick = () => {
                onConfirm();
                closeConfirmModal();
            };
            
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }

        // Close confirmation modal
        function closeConfirmModal() {
            const modal = document.getElementById('confirmModal');
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }

        // Admin login
        function showAdminLogin() {
            document.getElementById('adminModal').classList.remove('hidden');
            document.getElementById('adminModal').classList.add('flex');
        }

        function hideAdminLogin() {
            document.getElementById('adminModal').classList.add('hidden');
            document.getElementById('adminModal').classList.remove('flex');
        }

        document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('adminUsername').value;
            const password = document.getElementById('adminPassword').value;
            
            if (username === 'admin' && password === 'Tle019') {
                isAdmin = true;
                hideAdminLogin();
                showAdminPanel();
                showMessage('เข้าสู่ระบบผู้ดูแลสำเร็จ', 'success');
            } else {
                showMessage('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง', 'error');
            }
        });

        // Load admin files from Google Apps Script
        async function loadAdminFiles() {
            try {
                const response = await fetch('https://script.google.com/macros/s/AKfycbw3zVO-jxkz7RxeqngBk7kv7zClNlg-YphwLVu6vkC4bcvm9L0uErQKkn0NqBcZGthW/exec?action=getFiles', {
                    method: 'GET',
                    mode: 'no-cors'
                });
                
                // Since we're using no-cors, we can't read the response
                // We'll use a different approach with JSONP
                return new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
                    
                    window[callbackName] = function(data) {
                        document.head.removeChild(script);
                        delete window[callbackName];
                        uploadedFiles = data.files || [];
                        displayAdminFiles();
                        resolve(data);
                    };
                    
                    script.src = `https://script.google.com/macros/s/AKfycbw3zVO-jxkz7RxeqngBk7kv7zClNlg-YphwLVu6vkC4bcvm9L0uErQKkn0NqBcZGthW/exec?action=getFiles&callback=${callbackName}`;
                    script.onerror = reject;
                    document.head.appendChild(script);
                });
            } catch (error) {
                console.error('Error loading files:', error);
                showMessage('เกิดข้อผิดพลาดในการโหลดข้อมูลไฟล์', 'error');
            }
        }

        // Show admin panel
        async function showAdminPanel() {
            document.getElementById('customerSection').style.display = 'none';
            document.getElementById('adminPanel').classList.remove('hidden');
            await loadAdminFiles();
        }

        // Logout
        function logout() {
            isAdmin = false;
            document.getElementById('customerSection').style.display = 'block';
            document.getElementById('adminPanel').classList.add('hidden');
            showMessage('ออกจากระบบแล้ว', 'success');
        }

        // Display admin files
        function displayAdminFiles(filteredFiles = null) {
            const container = document.getElementById('filesList');
            const filesToShow = filteredFiles || uploadedFiles;
            
            if (filesToShow.length === 0) {
                container.innerHTML = '<p class="text-gray-500 text-center py-8">ไม่มีไฟล์ในระบบ</p>';
                return;
            }

            container.innerHTML = '';
            
            // Group files by order number
            const groupedFiles = {};
            filesToShow.forEach(file => {
                if (!groupedFiles[file.orderNumber]) {
                    groupedFiles[file.orderNumber] = [];
                }
                groupedFiles[file.orderNumber].push(file);
            });

            Object.keys(groupedFiles).forEach(orderNumber => {
                const orderFiles = groupedFiles[orderNumber];
                const orderDiv = document.createElement('div');
                orderDiv.className = 'border border-gray-200 rounded-lg p-4';
                
                orderDiv.innerHTML = `
                    <div class="flex justify-between items-center mb-3">
                        <h3 class="text-lg font-semibold text-gray-800">คำสั่งซื้อ: ${orderNumber}</h3>
                        <span class="text-sm text-gray-500">${orderFiles[0].uploadTime}</span>
                    </div>
                    <div class="space-y-2">
                        ${orderFiles.map(file => `
                            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div class="flex items-center space-x-3">
                                    <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <p class="font-medium text-gray-800">${file.fileName}</p>
                                        <p class="text-sm text-gray-500">${formatFileSize(file.size)}</p>
                                    </div>
                                </div>
                                <div class="flex items-center space-x-2">
                                    ${file.driveUrl ? `
                                        <a href="${file.driveUrl}" target="_blank" rel="noopener noreferrer" 
                                           class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm transition-colors flex items-center space-x-1">
                                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                                            </svg>
                                            <span>ดู</span>
                                        </a>
                                    ` : ''}
                                    <button onclick="deleteFile('${file.id}')" 
                                            class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm transition-colors flex items-center space-x-1">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                                        </svg>
                                        <span>ลบ</span>
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
                
                container.appendChild(orderDiv);
            });
        }

        // Search files
        function searchFiles() {
            const searchTerm = document.getElementById('searchOrder').value.trim();
            if (!searchTerm) {
                showMessage('กรุณากรอกหมายเลขคำสั่งซื้อที่ต้องการค้นหา', 'error');
                return;
            }

            const filteredFiles = uploadedFiles.filter(file => 
                file.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (filteredFiles.length === 0) {
                showMessage('ไม่พบไฟล์ที่ตรงกับหมายเลขคำสั่งซื้อที่ค้นหา', 'error');
            }

            displayAdminFiles(filteredFiles);
        }

        // Show all files
        function showAllFiles() {
            document.getElementById('searchOrder').value = '';
            displayAdminFiles();
        }

        // Delete file function
        async function deleteFile(fileId) {
            const file = uploadedFiles.find(f => f.id === fileId);
            if (!file) {
                showAlert('ไม่พบไฟล์ที่ต้องการลบ', 'error');
                return;
            }

            showConfirmModal(
                'ยืนยันการลบไฟล์',
                `คุณต้องการลบไฟล์ "${file.fileName}" ใช่หรือไม่? (ไฟล์จะถูกย้ายไปที่ถังขยะใน Google Drive)`,
                async () => {
                    try {
                        // Send delete request to Google Apps Script to move file to trash
                        const response = await fetch('https://script.google.com/macros/s/AKfycbw3zVO-jxkz7RxeqngBk7kv7zClNlg-YphwLVu6vkC4bcvm9L0uErQKkn0NqBcZGthW/exec', {
                            method: 'POST',
                            mode: 'no-cors',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                action: 'moveToTrash',
                                fileId: fileId,
                                driveFileId: file.driveFileId || null,
                                fileName: file.fileName
                            })
                        });

                        // Remove from local storage
                        uploadedFiles = uploadedFiles.filter(f => f.id !== fileId);
                        localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
                        
                        // Refresh display
                        displayAdminFiles();
                        
                        showAlert(`ย้ายไฟล์ "${file.fileName}" ไปที่ถังขยะสำเร็จ`, 'success');
                        
                    } catch (error) {
                        console.error('Delete error:', error);
                        showAlert('เกิดข้อผิดพลาดในการลบไฟล์', 'error');
                    }
                }
            );
        }



        // Show alert message
        function showAlert(message, type = 'info') {
            const container = document.getElementById('messageContainer');
            const messageDiv = document.createElement('div');
            
            let bgColor, icon;
            switch(type) {
                case 'success':
                    bgColor = 'bg-green-500';
                    icon = '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>';
                    break;
                case 'error':
                    bgColor = 'bg-red-500';
                    icon = '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>';
                    break;
                case 'info':
                    bgColor = 'bg-blue-500';
                    icon = '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>';
                    break;
                default:
                    bgColor = 'bg-gray-500';
                    icon = '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>';
            }
            
            messageDiv.className = `${bgColor} text-white px-6 py-4 rounded-xl shadow-lg mb-3 transform transition-all duration-300 flex items-center space-x-3`;
            messageDiv.innerHTML = `
                <div class="flex-shrink-0">${icon}</div>
                <div class="flex-1 font-medium">${message}</div>
                <button onclick="this.parentElement.remove()" class="flex-shrink-0 hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-colors">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                    </svg>
                </button>
            `;
            
            container.appendChild(messageDiv);
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                if (messageDiv.parentElement) {
                    messageDiv.style.transform = 'translateX(100%)';
                    setTimeout(() => {
                        if (messageDiv.parentElement) {
                            container.removeChild(messageDiv);
                        }
                    }, 300);
                }
            }, 5000);
        }

        // Legacy function for compatibility
        function showMessage(message, type) {
            showAlert(message, type);
        }
    