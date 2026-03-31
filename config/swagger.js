import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AMS Backend API (Full Version)',
      version: '1.0.0',
      description: 'Complete API documentation for the Attendance Management System. Integrates with Hugging Face AI for facial recognition.',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local Development Server',
      },
      {
        url: 'https://your-render-url.onrender.com', // Replace with your actual Render URL
        description: 'Production Server',
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    // Global security requirement (can be overridden per route)
    security: [{ bearerAuth: [] }], 
    paths: {
      
      // ════════════ LOGIN ROUTES ════════════
      '/api/v1/login': {
        post: {
          summary: 'User Login (Admin, Teacher, or Student)',
          tags: ['Authentication'],
          security: [], // No token required to login
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string', example: 'prof@university.edu' },
                    password: { type: 'string', example: 'password123' },
                    role: { type: 'string', example: 'teacher' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Login successful, returns JWT token' },
            401: { description: 'Invalid credentials' }
          }
        }
      },

      // ════════════ ADMIN ROUTES ════════════
      '/api/v1/admin/run-migration': {
        post: {
          summary: 'Run database migration for submissions',
          tags: ['Admin'],
          responses: {
            200: { description: 'Migration completed successfully' }
          }
        }
      },
      '/api/v1/admin/create-combined-section': {
        post: {
          summary: 'Auto-create a common section for electives',
          tags: ['Admin'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    commonSectionName: { type: 'string', example: 'AI-Elective' },
                    individualStudentSections: { type: 'array', items: { type: 'string' }, example: ['A', 'B'] },
                    courseCode: { type: 'string', example: 'CS505' },
                    teacherEmail: { type: 'string', example: 'prof@university.edu' },
                    roomNumber: { type: 'string', example: 'Lab 1' },
                    schedule: { type: 'array', items: { type: 'object' } }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: 'Combined section created and students auto-enrolled' }
          }
        }
      },

      // ════════════ SECTION ROUTES ════════════
      '/api/v1/section/create': {
        post: {
          summary: 'Create a standard section',
          tags: ['Sections'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    sectionName: { type: 'string', example: 'CSE-A' },
                    courseCode: { type: 'string', example: 'CS101' },
                    teacherEmail: { type: 'string', example: 'prof@university.edu' },
                    regNoPrefix: { type: 'string', example: '242703' },
                    schedule: { type: 'array', items: { type: 'object' } }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: 'Section created successfully' }
          }
        }
      },
      '/api/v1/section/': {
        get: {
          summary: 'Get all sections',
          tags: ['Sections'],
          responses: {
            200: { description: 'List of all sections' }
          }
        }
      },

      // ════════════ ATTENDANCE ROUTES ════════════
      '/api/v1/attendance/{attendanceId}/mark': {
        post: {
          summary: 'Mark attendance via AI Face Recognition',
          tags: ['Attendance'],
          parameters: [
            {
              name: 'attendanceId',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'The MongoDB ID of the attendance session'
            }
          ],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    images: {
                      type: 'array',
                      items: { type: 'string', format: 'binary' },
                      description: 'Classroom photos (Must match Multer config key)'
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Attendance marked successfully' },
            400: { description: 'Attendance is already locked or invalid' }
          }
        }
      },

      // ════════════ STUDENT ROUTES ════════════
      '/api/v1/student/': {
        get: {
          summary: 'Get all students',
          tags: ['Students'],
          responses: { 200: { description: 'List of students' } }
        },
        post: {
          summary: 'Register a new student',
          tags: ['Students'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', example: 'John Doe' },
                    regNo: { type: 'string', example: '2427010200' },
                    email: { type: 'string', example: 'john@student.edu' },
                    section: { type: 'string', example: 'A' }
                  }
                }
              }
            }
          },
          responses: { 201: { description: 'Student created' } }
        }
      },

      // ════════════ TEACHER ROUTES ════════════
      '/api/v1/teacher/': {
        get: {
          summary: 'Get all teachers',
          tags: ['Teachers'],
          responses: { 200: { description: 'List of teachers' } }
        },
        post: {
          summary: 'Register a new teacher',
          tags: ['Teachers'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', example: 'Dr. Smith' },
                    email: { type: 'string', example: 'smith@university.edu' },
                    department: { type: 'string', example: 'Computer Science' }
                  }
                }
              }
            }
          },
          responses: { 201: { description: 'Teacher created' } }
        }
      },

      // ════════════ COURSE ROUTES ════════════
      '/api/v1/course/': {
        get: {
          summary: 'Get all courses',
          tags: ['Courses'],
          responses: { 200: { description: 'List of courses' } }
        },
        post: {
          summary: 'Create a new course',
          tags: ['Courses'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    courseCode: { type: 'string', example: 'CS101' },
                    CourseName: { type: 'string', example: 'Intro to AI' },
                    Credits: { type: 'number', example: 4 }
                  }
                }
              }
            }
          },
          responses: { 201: { description: 'Course created' } }
        }
      },

      // ════════════ DASHBOARD ROUTES ════════════
      '/api/v1/dashboard/': {
        get: {
          summary: 'Get dashboard statistics',
          tags: ['Dashboard'],
          responses: {
            200: { description: 'Returns stats like total students, active classes, etc.' }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'], // Looks for inline comments if you decide to add them later
};

const swaggerSpec = swaggerJSDoc(options);

export const swaggerDocs = (app, port) => {
  // UI Route
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "AMS API Documentation",
    swaggerOptions: {
      docExpansion: "none", // Keeps the dropdowns collapsed by default for a clean look
      persistAuthorization: true // Keeps you logged in even if you refresh the page
    }
  }));
  
  // JSON Route
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  
  console.log(`📚 Full Swagger Docs available at http://localhost:${port}/api-docs`);
};