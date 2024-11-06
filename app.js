const canvas = document.getElementById('collageCanvas');
const ctx = canvas.getContext('2d');
let imagesByDate = {};
let selectedFiles = [];

// Handle image upload and store selected files
document.getElementById('imageUpload').addEventListener('change', (event) => {
    selectedFiles = Array.from(event.target.files);
    imagesByDate = {}; // Reset imagesByDate for each new selection
});

// Create collage after "Create Collage" button is clicked
function createCollage() {
    const loadImagePromises = selectedFiles.map((file) =>
        new Promise((resolve) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                const fileDate = new Date(file.lastModified);
                const dateKey = `${fileDate.getFullYear()}:${(fileDate.getMonth() + 1).toString().padStart(2, '0')}:${fileDate.getDate().toString().padStart(2, '0')}`;
                const timeKey = `${fileDate.getHours().toString().padStart(2, '0')}:${fileDate.getMinutes().toString().padStart(2, '0')}:${fileDate.getSeconds().toString().padStart(2, '0')}`;
                const formattedDate = formatDateString(dateKey);

                if (!imagesByDate[formattedDate]) {
                    imagesByDate[formattedDate] = { date: fileDate, images: [] };
                }
                imagesByDate[formattedDate].images.push({ img, time: timeKey });
                resolve();
            };
        })
    );

    Promise.all(loadImagePromises).then(() => drawCollage());
}

// Format date to "Weekday (DD.MM.YYYY)"
function formatDateString(dateString) {
    const [year, month, day] = dateString.split(":");
    const date = new Date(year, month - 1, day);
    const options = { weekday: 'long' };
    const weekday = date.toLocaleDateString('en-US', options);
    return `${weekday} (${day}.${month}.${year})`;
}

// Draw the collage on the canvas
function drawCollage() {
    const containerWidth = document.querySelector('.canvas-container').clientWidth;
    const imgWidth = 200; // Fixed width for layout alignment (adjust as needed)
    const rowPadding = 20; // Spacing between each date section
    const dateLabelHeight = 40; // Space for date label text
    let collageWidth = 0;
    let collageHeight = 0;

    // Sort dates in descending order
    const sortedDates = Object.entries(imagesByDate).sort((a, b) => b[1].date - a[1].date);

    // Calculate collage height and width
    sortedDates.forEach(([formattedDate, data]) => {
        const rows = Math.ceil(data.images.length / 5);
        collageHeight += rows * imgWidth + rowPadding + dateLabelHeight;
        collageWidth = Math.max(collageWidth, data.images.length * imgWidth);
    });

    // Set canvas dimensions to fit all images
    canvas.width = collageWidth;
    canvas.height = collageHeight;

    // Fill the background with white for PNG visibility on iOS
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let yOffset = 0;

    // Draw images by date
    sortedDates.forEach(([formattedDate, data]) => {
        ctx.fillStyle = 'black';
        ctx.font = "20px Arial";
        ctx.fillText(formattedDate, 10, yOffset + dateLabelHeight / 2);
        yOffset += dateLabelHeight;

        const rowImages = data.images.sort((a, b) => a.time.localeCompare(b.time));
        rowImages.forEach((imageData, i) => {
            const x = (i % 5) * imgWidth;
            const y = yOffset + Math.floor(i / 5) * imgWidth;
            ctx.drawImage(imageData.img, x, y, imgWidth, imgWidth); // Draw image in original dimensions
        });

        yOffset += Math.ceil(rowImages.length / 5) * imgWidth + rowPadding;
    });
}

// Download Collage
function downloadCollage() {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'collage.png';
    link.click();
}
