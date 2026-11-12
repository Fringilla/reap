import { useEffect, useState } from "react";
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

export function EventDialog({
  event,
  categories,
  categoryNames,
  creatorName,
  open,
  onOpenChange,
  onEventUpdated,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [formData, setFormData] = useState(() => getEditableEvent(event));

  useEffect(() => {
    if (open) {
      setFormData(getEditableEvent(event));
      setSaveError("");
      setIsEditing(false);
    }
  }, [open, event]);

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
    setIsSaving(true);
    setSaveError("");

    try {
      const response = await fetch(`http://localhost:3000/events/${event.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          startTime: new Date(formData.startTime).toISOString(),
          endTime: new Date(formData.endTime).toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Saving the event failed (${response.status}).`);
      }

      const updatedEvent = await response.json();
      onEventUpdated(updatedEvent);
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
          <Dialog.Content onClick={(clickEvent) => clickEvent.stopPropagation()}>
            <Dialog.Header>
              <Dialog.Title>{isEditing ? formData.title : event.title}</Dialog.Title>
            </Dialog.Header>
            <Box as="form" display="grid" gap="4" onSubmit={handleSave}>
              <Dialog.Body>
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
                    readOnly={!isEditing}
                    required={isEditing}
                  />
                </Field.Root>
                <Field.Root>
                  <Field.Label>Categories</Field.Label>
                  {isEditing ? (
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
                  ) : (
                    <Input value={categoryNames.join(", ")} readOnly />
                  )}
                </Field.Root>
                <Field.Root>
                  <Field.Label>Created by</Field.Label>
                  <Input value={creatorName} readOnly />
                </Field.Root>
                {saveError && <Box role="alert" color="red.500">{saveError}</Box>}
              </Dialog.Body>
              <Dialog.Footer>
                {isEditing ? (
                  <>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      type="button"
                      variant="subtle"
                      onClick={() => {
                        setFormData(getEditableEvent(event));
                        setSaveError("");
                        setIsEditing(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button type="button" variant="subtle" onClick={closeDialog}>Close</Button>
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
  categoryIds: event.categoryIds ?? [],
  startTime: toDateTimeLocal(event.startTime),
  endTime: toDateTimeLocal(event.endTime),
});

const toDateTimeLocal = (value) => {
  const date = new Date(value);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};
