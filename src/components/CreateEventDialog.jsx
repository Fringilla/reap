import { useState } from "react";
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

const emptyEvent = {
  title: "",
  description: "",
  image: "",
  location: "",
  startTime: "",
  endTime: "",
  createdBy: "",
  categoryIds: [],
};

export function CreateEventDialog() {
  const { categories, users, isLoading, error, createEvent } = useAppData();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(emptyEvent);
  const [formError, setFormError] = useState("");

  const updateFormField = (field) => (changeEvent) => {
    setFormData((previous) => ({ ...previous, [field]: changeEvent.target.value }));
  };

  const resetForm = () => {
    setFormData(emptyEvent);
    setFormError("");
  };

  const handleOpenChange = ({ open }) => {
    setIsOpen(open);
    if (!open) resetForm();
  };

  const handleSubmit = async (submitEvent) => {
    submitEvent.preventDefault();
    setFormError("");

    const requiredFields = ["title", "description", "image", "location", "startTime", "endTime", "createdBy"];
    if (requiredFields.some((field) => !String(formData[field]).trim())) {
      setFormError("Complete all required fields.");
      return;
    }
    if (formData.categoryIds.length === 0) {
      setFormError("Select at least one category.");
      return;
    }

    const startTime = new Date(formData.startTime);
    const endTime = new Date(formData.endTime);
    if (Number.isNaN(startTime.getTime()) || Number.isNaN(endTime.getTime())) {
      setFormError("Enter valid start and end times.");
      return;
    }
    if (endTime <= startTime) {
      setFormError("End time must be after start time.");
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

  return (
    <>
      <Button
        type="button"
        colorPalette="blue"
        variant="subtle"
        disabled={isLoading || Boolean(error)}
        onClick={() => {
          resetForm();
          setIsOpen(true);
        }}
      >
        Add Event
      </Button>
      <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content maxH="calc(100vh - 6rem)" display="flex" flexDirection="column">
              <Dialog.Header>
                <Dialog.Title>Add an event</Dialog.Title>
              </Dialog.Header>
              <Box as="form" display="flex" flexDirection="column" flex="1" minH="0" gap="4" onSubmit={handleSubmit}>
                <Dialog.Body flex="1" minH="0" overflowY="auto">
                  {isLoading ? (
                    <Box role="status">Loading form options...</Box>
                  ) : error ? (
                    <Box role="alert" color="red.500">{error}</Box>
                  ) : (
                    <>
                      <Field.Root>
                        <Field.Label>Title</Field.Label>
                        <Input value={formData.title} onChange={updateFormField("title")} required />
                      </Field.Root>
                      <Field.Root>
                        <Field.Label>Description</Field.Label>
                        <Textarea value={formData.description} onChange={updateFormField("description")} required />
                      </Field.Root>
                      <Field.Root>
                        <Field.Label>Image URL</Field.Label>
                        <Input type="url" value={formData.image} onChange={updateFormField("image")} required />
                      </Field.Root>
                      <Field.Root>
                        <Field.Label>Location</Field.Label>
                        <Input value={formData.location} onChange={updateFormField("location")} required />
                      </Field.Root>
                      <Field.Root>
                        <Field.Label>Start time</Field.Label>
                        <Input
                          type="datetime-local"
                          value={formData.startTime}
                          onChange={updateFormField("startTime")}
                          max={formData.endTime || undefined}
                          required
                        />
                      </Field.Root>
                      <Field.Root>
                        <Field.Label>End time</Field.Label>
                        <Input
                          type="datetime-local"
                          value={formData.endTime}
                          onChange={updateFormField("endTime")}
                          min={formData.startTime || undefined}
                          required
                        />
                      </Field.Root>
                      <Field.Root>
                        <Field.Label>Created by</Field.Label>
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
                      </Field.Root>
                      <Box
                        as="fieldset"
                        border="0"
                        p="0"
                        m="0"
                        minW="0"
                        aria-required="true"
                      >
                        <Box as="legend" fontWeight="medium" mb="2">
                          Categories (select at least one)
                        </Box>
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
                    </>
                  )}
                  {formError && <Box role="alert" color="red.500" mt="3">{formError}</Box>}
                </Dialog.Body>
                <Dialog.Footer flexShrink="0">
                  <Button type="submit" disabled={isLoading || Boolean(error) || isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create event"}
                  </Button>
                  <Button type="button" variant="subtle" onClick={() => handleOpenChange({ open: false })}>
                    Cancel
                  </Button>
                </Dialog.Footer>
              </Box>
              <Dialog.CloseTrigger asChild>
                <CloseButton aria-label="Close dialog" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}
