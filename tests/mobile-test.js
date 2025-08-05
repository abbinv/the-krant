// Mobile Responsiveness Test Script
// Run this in browser console to check for width overflow issues

function testMobileResponsiveness() {
    console.log('🔍 Testing Mobile Responsiveness...');
    
    const results = {
        overflowElements: [],
        wideElements: [],
        fixedWidthElements: [],
        issues: []
    };
    
    // Get viewport width
    const viewportWidth = window.innerWidth;
    console.log(`📱 Viewport width: ${viewportWidth}px`);
    
    // Check all elements for width overflow
    const allElements = document.querySelectorAll('*');
    
    allElements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(element);
        
        // Check for elements wider than viewport
        if (rect.width > viewportWidth) {
            results.overflowElements.push({
                element: element.tagName.toLowerCase(),
                class: element.className,
                width: rect.width,
                content: element.textContent?.substring(0, 50) + '...'
            });
        }
        
        // Check for fixed width elements that might cause issues
        if (computedStyle.width && computedStyle.width.includes('px') && 
            parseInt(computedStyle.width) > viewportWidth * 0.9) {
            results.fixedWidthElements.push({
                element: element.tagName.toLowerCase(),
                class: element.className,
                fixedWidth: computedStyle.width
            });
        }
        
        // Check for horizontal scrolling
        if (element.scrollWidth > element.clientWidth) {
            results.wideElements.push({
                element: element.tagName.toLowerCase(),
                class: element.className,
                scrollWidth: element.scrollWidth,
                clientWidth: element.clientWidth
            });
        }
    });
    
    // Check for horizontal page scroll
    const hasHorizontalScroll = document.body.scrollWidth > window.innerWidth;
    if (hasHorizontalScroll) {
        results.issues.push(`⚠️ Page has horizontal scroll: ${document.body.scrollWidth}px > ${window.innerWidth}px`);
    }
    
    // Report results
    console.log('📊 Test Results:');
    console.log('================');
    
    if (results.overflowElements.length > 0) {
        console.log('🚨 Elements wider than viewport:');
        results.overflowElements.forEach(item => {
            console.log(`  - ${item.element}.${item.class}: ${item.width}px`);
        });
    } else {
        console.log('✅ No elements wider than viewport');
    }
    
    if (results.fixedWidthElements.length > 0) {
        console.log('⚠️ Fixed width elements that might cause issues:');
        results.fixedWidthElements.forEach(item => {
            console.log(`  - ${item.element}.${item.class}: ${item.fixedWidth}`);
        });
    } else {
        console.log('✅ No problematic fixed width elements');
    }
    
    if (results.wideElements.length > 0) {
        console.log('📏 Elements with internal horizontal scroll:');
        results.wideElements.forEach(item => {
            console.log(`  - ${item.element}.${item.class}: ${item.scrollWidth}px > ${item.clientWidth}px`);
        });
    } else {
        console.log('✅ No elements with internal horizontal scroll');
    }
    
    if (results.issues.length > 0) {
        console.log('🔴 Issues found:');
        results.issues.forEach(issue => console.log(`  ${issue}`));
    } else {
        console.log('✅ No major issues detected');
    }
    
    // Test specific news content
    const newsArticles = document.querySelectorAll('.news-article');
    console.log(`\n📰 Testing ${newsArticles.length} news articles:`);
    
    newsArticles.forEach((article, index) => {
        const rect = article.getBoundingClientRect();
        const content = article.querySelector('.content');
        const contentRect = content ? content.getBoundingClientRect() : null;
        
        console.log(`  Article ${index + 1}:`);
        console.log(`    - Article width: ${rect.width}px`);
        if (contentRect) {
            console.log(`    - Content width: ${contentRect.width}px`);
            if (contentRect.width > viewportWidth) {
                console.log(`    ⚠️ Content exceeds viewport!`);
            }
        }
        
        // Check images in article
        const images = article.querySelectorAll('img');
        images.forEach((img, imgIndex) => {
            const imgRect = img.getBoundingClientRect();
            if (imgRect.width > viewportWidth) {
                console.log(`    🖼️ Image ${imgIndex + 1} exceeds viewport: ${imgRect.width}px`);
            }
        });
    });
    
    return results;
}

// Auto-run test when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', testMobileResponsiveness);
} else {
    testMobileResponsiveness();
}

// Export for manual testing
window.testMobileResponsiveness = testMobileResponsiveness;

console.log('📱 Mobile responsiveness test loaded. Run testMobileResponsiveness() to test manually.');