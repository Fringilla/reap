import { Box, Button, Checkbox, Field, Input, Text } from "@chakra-ui/react";

export const EventSearchFilters = ({
  categories,
  searchText,
  selectedCategoryIds,
  onSearchTextChange,
  onToggleCategory,
  onClearFilters,
}) => (
  <Box mb="6" display="grid" gap="4">
    <Field.Root>
      <Field.Label>Search events by title</Field.Label>
      <Input
        type="search"
        value={searchText}
        onChange={(changeEvent) => onSearchTextChange(changeEvent.target.value)}
        placeholder="Search events"
      />
    </Field.Root>
    <Box as="fieldset">
      <Text as="legend" fontWeight="semibold" mb="2">Filter by category</Text>
      <Box display="flex" flexWrap="wrap" gap="4">
        {categories.map((category) => (
          <Checkbox.Root
            key={category.id}
            checked={selectedCategoryIds.includes(String(category.id))}
            onCheckedChange={({ checked }) => onToggleCategory(category.id, checked)}
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>{category.name}</Checkbox.Label>
          </Checkbox.Root>
        ))}
      </Box>
    </Box>
    <Button
      type="button"
      variant="subtle"
      alignSelf="start"
      onClick={onClearFilters}
      disabled={!searchText && selectedCategoryIds.length === 0}
    >
      Clear search and filters
    </Button>
  </Box>
);
