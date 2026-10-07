# Equipment Lending Catalogue

## 1. Application Purpose

This is a full-stack web application built for a school, makerspace, or club to manage an equipment lending catalogue. Users can browse available equipment, search and filter the list, view specific item details, and add, edit, or delete items.

## 2. Required Software

To run this project, you need:

- **Node.js** installed on your computer.
- A terminal (Command Prompt, PowerShell, or Mac/Linux Terminal).
- A web browser (Chrome, Firefox, Edge, etc.).

## 3. Installation and Start Commands

Because this project has two separate parts (frontend and backend), you need to run two terminal windows at the same time.

**Step 1: Start the Backend (Express API)**

1. Open a terminal and navigate to the server folder: `cd server`
2. Install dependencies: `npm install`
3. Start the server: `npm run dev`

**Step 2: Start the Frontend (React)**

1. Open a second terminal and navigate to the main project folder: `cd equipment-app` (or just stay in the root if already there)
2. Install dependencies: `npm install`
3. Start the React app: `npm run dev`

## 4. Development URLs and Ports

- **Frontend (React UI):** Runs on `http://localhost:5173`
- **Backend (Express API):** Runs on `http://localhost:3001`

## 5. Browser Route Table (Frontend)

| Browser Path      | View Description                                                     |
| :---------------- | :------------------------------------------------------------------- |
| `/`               | Home page with a short welcome explanation.                          |
| `/items`          | Searchable and filterable equipment list with borrow/delete buttons. |
| `/items/new`      | Blank form to add a new piece of equipment.                          |
| `/items/:id`      | Detailed view for one specific item.                                 |
| `/items/:id/edit` | Pre-filled form to update an existing item.                          |
| `/external`       | Read-only view showing external tech products.                       |
| `*`               | 404 Fallback page for unknown URLs.                                  |

## 6. API Endpoint Table (Backend)

| Method & Path        | Successful Response                                              |
| :------------------- | :--------------------------------------------------------------- |
| `GET /api/health`    | `200 OK` JSON confirming the server is alive.                    |
| `GET /api/items`     | `200 OK` JSON array containing all equipment.                    |
|                      |
| `GET /api/items/:id` | `200 OK` JSON object for one specific item                       |
|                      |
| `POST /api/items`    | `201 Created` JSON containing the newly created item with its ID |

|  
| `PATCH /api/items/:id` | `200 OK` JSON containing the complete updated item. |
| `DELETE /api/items/:id` | `200 OK` JSON confirming the item was removed. |

## 7. Data Shape and Validation Summary

Every equipment item uses this exact data shape:

```json
{
    "id": 1,
    "name": "Sony Wireless Mic",
    "category": "Audio",
    "location": "Studio A",
    "condition": "Excellent",
    "dailyPrice": 15,
    "available": true
}
```
