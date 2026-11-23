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
  open,
  startInEditMode = false,
  onOpenChange,
}) {
  const {
    categories,
    users,
    updateEvent,
    getCategoryNames,
    getCreatorName,
  } = useAppData();
  const categoryNames = getCategoryNames(event.categoryIds);
  const creatorName = getCreatorName(event.createdBy);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState(() => getEditableEvent(event));
  const hasInitializedForOpen = useRef(false);

  useEffect(() => {
    if (!open) {
      hasInitializedForOpen.current = false;
      return;
    }

    setFormData(getEditableEvent(event));
    setFormError("");
    if (!hasInitializedForOpen.current) {
      setIsEditing(startInEditMode);
      hasInitializedForOpen.current = true;
    }
  }, [open, event, startInEditMode]);

  const handleOpenChange = ({ open: isOpen }) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      setFormData(getEditableEvent(event));
      setFormError("");
      setIsEditing(false);
    }
  };

  const updateFormField = (field) => (changeEvent) => {
    setFormData((previous) => ({ ...previous, [field]: changeEvent.target.value }));
  };

  const handleSubmit = async (submitEvent) => {
    submitEvent.preventDefault();
    setFormError("");

    var errors = [];
    if (formData.categoryIds.length === 0) {
      errors.push("Select at least one category.");
    }

    const startTime = new Date(formData.startTime);
    const endTime = new Date(formData.endTime);
    if (Number.isNaN(startTime.getTime()) || Number.isNaN(endTime.getTime())) {
      errors.push("Enter valid start and end times.");
    }
    if (endTime <= startTime) {
      errors.push("End time must be after start time.");
    }

    const requiredFields = ["title", "description", "location", "startTime", "endTime", "createdBy"];
    if (requiredFields.some((field) => !String(formData[field]).trim())) {
      errors.push("Complete all required fields.");
    }

    if (errors.length > 0) {
      setFormError(errors.map((error, index) => (
        <Box key={index} role="alert" color="red.500" mt="3">- {error}</Box>
      )));
      return;
    }
    setIsSubmitting(true);
    try {
      const createdEvent = await createEvent({
        title: formData.title.trim(),
        description: formData.description.trim(),
        image: formData.image.trim(),
        location: formData.location.trim(),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        createdBy: Number(formData.createdBy),
        categoryIds: formData.categoryIds,
      });

      handleOpenChange({ open: false });
      resetForm();
      toaster.create({
        title: "Event created",
        description: `${createdEvent.title} was added successfully.`,
        type: "success",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not create the event.";
      setFormError(message);
      toaster.create({ title: "Could not create event", description: message, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeDialog = () => {
    onOpenChange(false);
    setFormData(getEditableEvent(event));
    setFormError("");
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
            <Box as="form" display="flex" flexDirection="column" flex="1" minH="0" gap="4" onSubmit={handleSubmit} noValidate>
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
                {true || isEditing ? (
                  <Box as="fieldset" border="0" p="0" m="0" minW="0" aria-required="true">
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
                {formError && <Box role="alert" color="red.500">{formError}</Box>}
              </Dialog.Body>
              <Dialog.Footer flexShrink="0">
                {isEditing ? (
                  <>
                    <Button type="submit" disabled={isSubmitting} colorPalette="blue" variant="subtle">
                      {isSubmitting ? "Saving..." : "Save"}
                    </Button>
                    <Button type="button" colorPalette="gray" variant="subtle" onClick={closeDialog}>Cancel</Button>
                  </>
                ) : (
                  <>
                    <Button type="button" colorPalette="blue" variant="subtle"
                      onClick={() => {
                        setFormData(getEditableEvent(event));
                        setSaveError("");
                        setIsEditing(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button type="button" colorPalette="gray" variant="subtle" onClick={closeDialog}>Close</Button>
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
