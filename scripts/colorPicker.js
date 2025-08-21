// Custom Color Picker Implementation
// Provides HSV-based color selection without showing hex values

class CustomColorPicker {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.colorArea = document.getElementById('color-area');
        this.colorSelector = document.getElementById('color-selector');
        this.hueSlider = document.getElementById('hue-slider');
        this.hueHandle = document.getElementById('hue-handle');
        this.selectedColor = document.getElementById('selected-color');
        
        // Color values
        this.hue = 0;
        this.saturation = 100;
        this.value = 100;
        
        this.isDraggingSelector = false;
        this.isDraggingHue = false;
        
        this.initializeColorPicker();
        this.attachEventListeners();
        this.updateColorDisplay();
    }
    
    initializeColorPicker() {
        // Set initial positions
        this.colorSelector.style.left = '100%';
        this.colorSelector.style.top = '0%';
        this.hueHandle.style.left = '0%';
    }
    
    attachEventListeners() {
        // Color area events
        this.colorArea.addEventListener('mousedown', (e) => this.startColorSelection(e));
        this.colorArea.addEventListener('touchstart', (e) => this.startColorSelection(e), { passive: false });
        
        // Hue slider events
        this.hueSlider.addEventListener('mousedown', (e) => this.startHueSelection(e));
        this.hueSlider.addEventListener('touchstart', (e) => this.startHueSelection(e), { passive: false });
        
        // Global mouse/touch events
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('mouseup', () => this.stopDragging());
        document.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        document.addEventListener('touchend', () => this.stopDragging());
    }
    
    startColorSelection(e) {
        e.preventDefault();
        this.isDraggingSelector = true;
        this.updateColorSelection(e);
    }
    
    startHueSelection(e) {
        e.preventDefault();
        this.isDraggingHue = true;
        this.updateHueSelection(e);
    }
    
    handleMouseMove(e) {
        if (this.isDraggingSelector) {
            this.updateColorSelection(e);
        } else if (this.isDraggingHue) {
            this.updateHueSelection(e);
        }
    }
    
    handleTouchMove(e) {
        e.preventDefault();
        if (this.isDraggingSelector) {
            this.updateColorSelection(e.touches[0]);
        } else if (this.isDraggingHue) {
            this.updateHueSelection(e.touches[0]);
        }
    }
    
    stopDragging() {
        this.isDraggingSelector = false;
        this.isDraggingHue = false;
    }
    
    updateColorSelection(e) {
        const rect = this.colorArea.getBoundingClientRect();
        const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
        const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
        
        this.saturation = (x / rect.width) * 100;
        this.value = ((rect.height - y) / rect.height) * 100;
        
        this.colorSelector.style.left = `${(x / rect.width) * 100}%`;
        this.colorSelector.style.top = `${(y / rect.height) * 100}%`;
        
        this.updateColorDisplay();
    }
    
    updateHueSelection(e) {
        const rect = this.hueSlider.getBoundingClientRect();
        const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
        
        this.hue = (x / rect.width) * 360;
        
        this.hueHandle.style.left = `${(x / rect.width) * 100}%`;
        
        this.updateColorAreaBackground();
        this.updateColorDisplay();
    }
    
    updateColorAreaBackground() {
        const hueColor = this.hsvToRgb(this.hue, 100, 100);
        const hueHex = this.rgbToHex(hueColor.r, hueColor.g, hueColor.b);
        
        this.colorArea.style.background = `
            linear-gradient(to right, #fff, transparent),
            linear-gradient(to top, #000, transparent),
            ${hueHex}
        `;
    }
    
    updateColorDisplay() {
        const rgb = this.hsvToRgb(this.hue, this.saturation, this.value);
        const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
        
        this.selectedColor.style.backgroundColor = hex;
        
        // Trigger callback if set
        if (this.onColorChange) {
            this.onColorChange(hex, rgb);
        }
    }
    
    // Convert HSV to RGB
    hsvToRgb(h, s, v) {
        h = h / 360;
        s = s / 100;
        v = v / 100;
        
        const i = Math.floor(h * 6);
        const f = h * 6 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);
        
        let r, g, b;
        
        switch (i % 6) {
            case 0: r = v; g = t; b = p; break;
            case 1: r = q; g = v; b = p; break;
            case 2: r = p; g = v; b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            case 5: r = v; g = p; b = q; break;
        }
        
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }
    
    // Convert RGB to Hex
    rgbToHex(r, g, b) {
        const toHex = (n) => {
            const hex = n.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
    
    // Get current color as hex
    getCurrentColor() {
        const rgb = this.hsvToRgb(this.hue, this.saturation, this.value);
        return this.rgbToHex(rgb.r, rgb.g, rgb.b);
    }
    
    // Reset to a default color
    reset() {
        this.hue = 0;
        this.saturation = 100;
        this.value = 100;
        
        this.colorSelector.style.left = '100%';
        this.colorSelector.style.top = '0%';
        this.hueHandle.style.left = '0%';
        
        this.updateColorAreaBackground();
        this.updateColorDisplay();
    }
}
