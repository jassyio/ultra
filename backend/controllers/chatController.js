const Message = require("../models/Message");

// 📝 SEND MESSAGE
exports.sendMessage = async (req, res) => {
    try {
        const { sender, receiver, content } = req.body;

        if (!sender || !receiver || !content) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const message = new Message({ sender, receiver, content });
        await message.save();

        res.status(201).json({ message: "Message sent successfully", data: message });
    } catch (err) {
        console.error("Error sending message:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// 📝 GET MESSAGES BETWEEN TWO USERS
exports.getMessages = async (req, res) => {
    try {
        const { sender, receiver } = req.params;

        const messages = await Message.find({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender }
            ]
        }).sort({ timestamp: 1 });

        res.status(200).json(messages);
    } catch (err) {
        console.error("Error retrieving messages:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
