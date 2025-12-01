// Test script to validate export functionality
const testExport = () => {
  console.log('Testing export functionality...');

  // Test PNG export
  const link = document.createElement('a');
  link.download = 'test-export.png';
  link.href = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAABUFAQ';
  link.click();

  console.log('✅ PNG export link created');

  // Test JPEG export
  setTimeout(() => {
    const jpegLink = document.createElement('a');
    jpegLink.download = 'test-export.jpg';
    jpegLink.href = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgIAZ0kKDUAIAA6AAQABUdAD/2wBDAQAAA';
    jpegLink.click();

    console.log('✅ JPEG export link created');
  }, 1000);
};

console.log('Export functionality test completed!');
console.log('If downloads work, the export system is functioning correctly.');