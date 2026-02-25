/**
 * Handle successful file upload response
 */
const uploadFiles = async (req, res) => {
    try {
        if (!req.file && (!req.files || req.files.length === 0)) {
            return res.status(400).json({
                success: false,
                message: "Please upload a file",
            });
        }

        // Single file response
        if (req.file) {
            return res.status(200).json({
                success: true,
                message: "File uploaded successfully",
                data: {
                    url: req.file.location,
                    key: req.file.key,
                    mimetype: req.file.mimetype,
                    size: req.file.size,
                },
            });
        }

        // Multiple files response (if needed in future)
        const fileData = req.files.map((file) => ({
            url: file.location,
            key: file.key,
            mimetype: file.mimetype,
            size: file.size,
        }));

        return res.status(200).json({
            success: true,
            message: "Files uploaded successfully",
            data: fileData,
        });
    } catch (error) {
        console.error("Upload controller error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during upload",
            error: error.message,
        });
    }
};

module.exports = {
    uploadFiles,
};
