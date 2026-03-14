type Field = {
    label: string,
    type: "CalendarType" | "InputType" | "ChipType" | "DropdownType" | "SelectType",
}

type Section = {
    sectionTitle: string,
    field: Field
}