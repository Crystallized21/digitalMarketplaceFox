import { Access, CollectionConfig } from "payload/types";
import { PrimaryActionEmailHtml } from "../components/emails/PrimaryActionEmail";

// Access control for the Users collection

const adminsAndUsers: Access = ({req: {user}}) => {
    if (user.role == "admin") return true

    return {
        id: {
            equals: user.id
        },
    }
}

// Collection definition for the Users collection

export const Users: CollectionConfig = {
    slug: "users",
    auth: {
        verify: {
            generateEmailHTML: ({token}) => {
                return PrimaryActionEmailHtml({
                    actionLabel: "verify your account",
                    buttonText: "Verify Account",
                    href: `${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}`
                })
            },
        }
    },
    access: {
        read: adminsAndUsers,
        create: () => true,
        update: ({req}) => req.user.role == "admin",
        delete: ({req}) => req.user.role == "admin",
    },
    admin: {
        hidden: ({user}) => user.role !== "admin",
        defaultColumns: ["id"],
    },
    fields: [
        {
            name: "products",
            label: "Products",
            admin: {
                condition: () => false
            },
            type: "relationship",
            relationTo: "products",
            hasMany: true,
        },
        {
            name: "product_files",
            label: "Product Files",
            admin: {
                condition: () => false
            },
            type: "relationship",
            relationTo: "product_files",
            hasMany: true,
        },
        {
            name: "role",
            defaultValue: "user",
            required: true,
            type: "select",
            options: [
                {label: "Admin", value: "admin"},
                {label: "User", value: "user"}
            ]
        },
    ]
}