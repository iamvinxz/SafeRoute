import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const AnnouncementCard = ({ title, content, author, createdAt }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <>
      <TouchableOpacity
        style={styles.card}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <View style={styles.header}>
          <Ionicons name="megaphone-outline" size={16} color="#378ADD" />
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
        </View>

        {content ? (
          <Text style={styles.content} numberOfLines={2}>
            {content}
          </Text>
        ) : (
          <Text style={styles.content}>No content for this announcement</Text>
        )}

        <View style={styles.footer}>
          <Text style={styles.author}>{author ?? "—"}</Text>
          {formattedDate ? (
            <Text style={styles.date}>{formattedDate}</Text>
          ) : null}
        </View>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                {/* Handle bar */}
                <View style={styles.handle} />

                {/* Badge */}
                <View style={styles.badge}>
                  <Ionicons
                    name="megaphone-outline"
                    size={13}
                    color="#378ADD"
                  />
                  <Text style={styles.badgeText}>Announcement</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  <Text style={styles.modalTitle}>{title}</Text>
                  <Text style={styles.modalContent}>
                    {content ?? "No content for this announcement."}
                  </Text>

                  <View style={styles.divider} />

                  <View style={styles.modalMeta}>
                    <Text style={styles.metaText}>
                      Posted by{" "}
                      <Text style={styles.metaAuthor}>{author ?? "—"}</Text>
                    </Text>
                    {formattedDate && (
                      <Text style={styles.metaText}>{formattedDate}</Text>
                    )}
                  </View>
                </ScrollView>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH - 32,
    height: 115,
    alignSelf: "center",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    borderLeftWidth: 3,
    borderLeftColor: "#378ADD",
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: "space-between",
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 7,
  },
  title: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Montserrat-Bold",
    color: "#1a1a1a",
    lineHeight: 18,
  },
  content: {
    fontSize: 11,
    fontFamily: "Montserrat",
    color: "#6b6b6b",
    lineHeight: 16,
    marginTop: 2,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  author: {
    fontSize: 11,
    fontFamily: "Montserrat",
    color: "#6b6b6b",
  },
  date: {
    fontSize: 11,
    fontFamily: "Montserrat",
    color: "#6b6b6b",
  },

  // Modal
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 32,
    maxHeight: SCREEN_HEIGHT * 0.75,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    backgroundColor: "#EBF4FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 14,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: "Montserrat-Bold",
    color: "#378ADD",
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: "Montserrat-Bold",
    color: "#1a1a1a",
    lineHeight: 22,
    marginBottom: 10,
  },
  modalContent: {
    fontSize: 13,
    fontFamily: "Montserrat",
    color: "#444",
    lineHeight: 20,
    marginBottom: 20,
  },
  divider: {
    borderTopWidth: 0.5,
    borderColor: "#e0e0e0",
    marginBottom: 16,
  },
  modalMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metaText: {
    fontSize: 12,
    fontFamily: "Montserrat",
    color: "#888",
  },
  metaAuthor: {
    fontFamily: "Montserrat-Bold",
    color: "#555",
  },
  closeButton: {
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#378ADD",
    paddingVertical: 13,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#378ADD",
    fontSize: 14,
    fontFamily: "Montserrat-Bold",
  },
});

export default AnnouncementCard;
