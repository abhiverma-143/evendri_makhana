 // --- Cart State & Logic ---
        // Persistent storage ensures cart stays filled between index and product pages
        let cart = JSON.parse(localStorage.getItem('evendri_cart')) || [];

        const CartManager = {
            // Core function to add items
            add(id, name, price, img) {
                const existingItem = cart.find(item => item.id === id);
                if (existingItem) {
                    existingItem.qty += 1;
                } else {
                    cart.push({ id, name, price, img, qty: 1 });
                }
                this.saveAndRender();
                this.openCartUI(); // Auto-open the drawer when an item is added
            },

            // Handles + and - buttons inside the drawer
            updateQty(id, delta) {
                const item = cart.find(item => item.id === id);
                if (item) {
                    item.qty += delta;
                    if (item.qty <= 0) this.remove(id);
                    else this.saveAndRender();
                }
            },

            // Deletes an item entirely
            remove(id) {
                cart = cart.filter(item => item.id !== id);
                this.saveAndRender();
            },

            saveAndRender() {
                localStorage.setItem('evendri_cart', JSON.stringify(cart));
                this.render();
            },

            // Syncs the HTML drawer with the current cart data
            render() {
                const container = document.getElementById('cart-items-container');
                const subtotalEl = document.getElementById('cart-subtotal');
                const badges = document.querySelectorAll('#cart-btn span, #cart-btn-mobile span');

                // Update orange badge count
                const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
                badges.forEach(b => b.innerText = totalQty);

                if (!container) return; // Prevent errors if drawer isn't on the current page

                if (cart.length === 0) {
                    container.innerHTML = `<div class="text-center py-10 text-gray-400">Your bag is empty</div>`;
                    subtotalEl.innerText = `₹0`;
                    return;
                }

                let html = '';
                let subtotal = 0;

                cart.forEach(item => {
                    subtotal += (item.price * item.qty);
                    html += `
                <div class="flex items-center justify-between bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                    <div class="flex items-center">
                        <img src="${item.img}" class="w-16 h-16 rounded-xl object-cover shadow-sm">
                        <div class="ml-4">
                            <h4 class="font-bold text-primary text-sm">${item.name}</h4>
                            <p class="font-black text-secondary mt-1">₹${item.price}</p>
                        </div>
                    </div>
                    <div class="text-right flex flex-col items-end">
                        <button onclick="CartManager.remove(${item.id})" class="text-gray-300 hover:text-red-500 transition mb-2"><i class="fas fa-trash-alt"></i></button>
                        <div class="flex items-center border rounded-lg px-2 py-1 bg-gray-50">
                            <button onclick="CartManager.updateQty(${item.id}, -1)" class="text-gray-500 hover:text-primary px-1">-</button>
                            <span class="px-2 text-sm font-bold">${item.qty}</span>
                            <button onclick="CartManager.updateQty(${item.id}, 1)" class="text-gray-500 hover:text-primary px-1">+</button>
                        </div>
                    </div>
                </div>`;
                });

                container.innerHTML = html;
                subtotalEl.innerText = `₹${subtotal}`;
            },

            // Triggers the drawer to slide out
            openCartUI() {
                const drawer = document.getElementById('cart-drawer');
                const overlay = document.getElementById('overlay');
                if (drawer) drawer.classList.remove('translate-x-full');
                if (overlay) {
                    overlay.classList.remove('hidden');
                    setTimeout(() => overlay.classList.remove('opacity-0'), 10);
                }
            }
        };