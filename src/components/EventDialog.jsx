import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CloseButton,
  Dialog,
  Field,
  Input,
  Portal,
  Textarea,
} from "@chakra-ui/react";
import { toaster } from "./ui/toaster";
import { useAppData } from "../context/AppDataContext";

export function EventDialog({
  event,
  categories,
  categoryNames,
  creatorName,
  open,
  startInEditMode = false,
  onOpenChange,
}) {
  const { users, updateEvent } = useAppData();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [formData, setFormData] = useState(() => getEditableEvent(event));
  const hasInitializedForOpen = useRef(false);

  useEffect(() => {
    if (!open) {
      hasInitializedForOpen.current = false;
      return;
    }

    setFormData(getEditableEvent(event));
    setSaveError("");
    if (!hasInitializedForOpen.current) {
      setIsEditing(startInEditMode);
      hasInitializedForOpen.current = true;
    }
  }, [open, event, startInEditMode]);

  const handleOpenChange = ({ open: isOpen }) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      setFormData(getEditableEvent(event));
      setSaveError("");
      setIsEditing(false);
    }
  };
  const updateFormField = (field) => (changeEvent) => {
    setFormData((previous) => ({ ...previous, [field]: changeEvent.target.value }));
  };
  const handleSave = async (submitEvent) => {
    submitEvent.preventDefault();
    setSaveError("");

    const requiredFields = ["title", "description", "image", "location", "startTime", "endTime", "createdBy"];
    if (requiredFields.some((field) => !String(formData[field]).trim())) {
      setSaveError("Complete all required fields.");
      return;
    }
    if (formData.categoryIds.length === 0) {
      setSaveError("Select at least one category.");
      return;
    }

    const startTime = new Date(formData.startTime);
    const endTime = new Date(formData.endTime);
    if (Number.isNaN(startTime.getTime()) || Number.isNaN(endTime.getTime())) {
      setSaveError("Enter valid start and end times.");
      return;
    }
    if (endTime <= startTime) {
      setSaveError("End time must be after start time.");
      return;
    }

    setIsSaving(true);
    try {
      const updatedEvent = await updateEvent(event.id, {
        ...formData,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      });

      setFormData(getEditableEvent(updatedEvent));
      setIsEditing(false);
      toaster.create({
        title: "Event updated",
        description: `${updatedEvent.title} was updated successfully.`,
        type: "success",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not save the event.";
      setSaveError(message);
      toaster.create({ title: "Could not update event", description: message, type: "error" });
    } finally {
      setIsSaving(false);
    }
  };
  const closeDialog = () => {
    onOpenChange(false);
    setFormData(getEditableEvent(event));
    setSaveError("");
    setIsEditing(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            maxH="calc(100vh - 6rem)"
            display="flex"
            flexDirection="column"
            onClick={(clickEvent) => clickEvent.stopPropagation()}
          >
            <Dialog.Header>
              <Dialog.Title>{isEditing ? formData.title : event.title}</Dialog.Title>
            </Dialog.Header>
            <Box as="form" display="flex" flexDirection="column" flex="1" minH="0" gap="4" onSubmit={handleSave}>
              <Dialog.Body flex="1" minH="0" overflowY="auto">
                <Field.Root>
                  <Field.Label>Title</Field.Label>
                  <Input
                    value={isEditing ? formData.title : event.title}
                    onChange={updateFormField("title")}
                    readOnly={!isEditing}
                    required={isEditing}
                  />
                </Field.Root>
                <Field.Root>
                  <Field.Label>Description</Field.Label>
                  <Textarea
                    value={isEditing ? formData.description : event.description}
                    onChange={updateFormField("description")}
                    readOnly={!isEditing}
                    required={isEditing}
                  />
                </Field.Root>
                <Field.Root>
                  <Field.Label>Image URL</Field.Label>
                  <Input
                    type="url"
                    value={isEditing ? formData.image : event.image}
                    onChange={updateFormField("image")}
                    readOnly={!isEditing}
                    required={isEditing}
                  />
                </Field.Root>
                <Field.Root>
                  <Field.Label>Location</Field.Label>
                  <Input
                    value={isEditing ? formData.location : event.location}
                    onChange={updateFormField("location")}
                    readOnly={!isEditing}
                    required={isEditing}
                  />
                </Field.Root>
                <Field.Root>
                  <Field.Label>Start time</Field.Label>
                  <Input
                    type={isEditing ? "datetime-local" : "text"}
                    value={isEditing ? formData.startTime : new Date(event.startTime).toLocaleString()}
                    onChange={updateFormField("startTime")}
                    max={isEditing ? formData.endTime || undefined : undefined}
                    readOnly={!isEditing}
                    required={isEditing}
                  />
                </Field.Root>
                <Field.Root>
                  <Field.Label>End time</Field.Label>
                  <Input
                    type={isEditing ? "datetime-local" : "text"}
                    value={isEditing ? formData.endTime : new Date(event.endTime).toLocaleString()}
                    onChange={updateFormField("endTime")}
                    min={isEditing ? formData.startTime || undefined : undefined}
                    readOnly={!isEditing}
                    required={isEditing}
                  />
                </Field.Root>
                {isEditing ? (
                  <Box
                    as="fieldset"
                    border="0"
                    p="0"
                    m="0"
                    minW="0"
                    aria-required="true"
                  >
                    <Box as="legend" fontWeight="medium" mb="2">Categories</Box>
                    <Box display="flex" flexWrap="wrap" gap="3">
                      {categories.map((category) => (
                        <Checkbox.Root
                          key={category.id}
                          checked={formData.categoryIds.includes(category.id)}
                          onCheckedChange={({ checked }) => {
                            setFormData((previous) => ({
                              ...previous,
                              categoryIds: checked
                                ? [...previous.categoryIds, category.id]
                                : previous.categoryIds.filter((categoryId) => categoryId !== category.id),
                            }));
                          }}
                        >
                          <Checkbox.HiddenInput />
                          <Checkbox.Control />
                          <Checkbox.Label>{category.name}</Checkbox.Label>
                        </Checkbox.Root>
                      ))}
                    </Box>
                  </Box>
                ) : (
                  <Field.Root>
                    <Field.Label>Categories</Field.Label>
                    <Input value={categoryNames.join(", ")} readOnly />
                  </Field.Root>
                )}
                <Field.Root>
                  <Field.Label>Created by</Field.Label>
                  {isEditing ? (
                    <select
                      value={formData.createdBy}
                      onChange={updateFormField("createdBy")}
                      required
                      style={{ width: "100%", padding: "0.5rem", borderRadius: "0.375rem" }}
                    >
                      <option value="">Select a creator</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                      ))}
                    </select>
                  ) : (
                    <Input value={creatorName} readOnly />
                  )}
                </Field.Root>
                {saveError && <Box role="alert" color="red.500">{saveError}</Box>}
              </Dialog.Body>
              <Dialog.Footer flexShrink="0">
                {isEditing ? (
                  <>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                    <Button type="button" variant="subtle" onClick={closeDialog}>Cancel</Button>
                  </>
                ) : (
                  <>
                    <Button
                      type="button"
                      onClick={() => {
                        setFormData(getEditableEvent(event));
                        setSaveError("");
                        setIsEditing(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button type="button" variant="subtle" onClick={closeDialog}>Close</Button>
                  </>
                )}
              </Dialog.Footer>
            </Box>
            <Dialog.CloseTrigger asChild>
              <CloseButton />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

const getEditableEvent = (event) => ({
  title: event.title ?? "",
  description: event.description ?? "",
  image: event.image ?? "",
  location: event.location ?? "",
  createdBy: event.createdBy == null ? "" : String(event.createdBy),
  categoryIds: event.categoryIds ?? [],
  startTime: toDateTimeLocal(event.startTime),
  endTime: toDateTimeLocal(event.endTime),
});

const toDateTimeLocal = (value) => {
  const date = new Date(value);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};
