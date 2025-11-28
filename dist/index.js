#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { assignmentTools } from './tools/dropbox.js';
import { contentTools } from './tools/content.js';
import { gradeTools } from './tools/grades.js';
import { calendarTools } from './tools/calendar.js';
import { newsTools } from './tools/news.js';
import { enrollmentTools } from './tools/enrollments.js';
import { downloadFile } from './tools/files.js';
const server = new McpServer({
    name: 'd2l-brightspace',
    version: '1.0.0',
});
// Register assignment tools
server.tool('get_assignments', assignmentTools.get_assignments.description, { orgUnitId: assignmentTools.get_assignments.schema.orgUnitId }, async (args) => {
    const result = await assignmentTools.get_assignments.handler(args);
    return { content: [{ type: 'text', text: result }] };
});
server.tool('get_assignment', assignmentTools.get_assignment.description, {
    orgUnitId: assignmentTools.get_assignment.schema.orgUnitId,
    assignmentId: assignmentTools.get_assignment.schema.assignmentId,
}, async (args) => {
    const result = await assignmentTools.get_assignment.handler(args);
    return { content: [{ type: 'text', text: result }] };
});
server.tool('get_assignment_submissions', assignmentTools.get_assignment_submissions.description, {
    orgUnitId: assignmentTools.get_assignment_submissions.schema.orgUnitId,
    assignmentId: assignmentTools.get_assignment_submissions.schema.assignmentId,
}, async (args) => {
    const result = await assignmentTools.get_assignment_submissions.handler(args);
    return { content: [{ type: 'text', text: result }] };
});
// Register content tools
server.tool('get_course_content', contentTools.get_course_content.description, { orgUnitId: contentTools.get_course_content.schema.orgUnitId }, async (args) => {
    const result = await contentTools.get_course_content.handler(args);
    return { content: [{ type: 'text', text: result }] };
});
server.tool('get_course_topic', contentTools.get_course_topic.description, {
    orgUnitId: contentTools.get_course_topic.schema.orgUnitId,
    topicId: contentTools.get_course_topic.schema.topicId,
}, async (args) => {
    const result = await contentTools.get_course_topic.handler(args);
    return { content: [{ type: 'text', text: result }] };
});
server.tool('get_course_modules', contentTools.get_course_modules.description, { orgUnitId: contentTools.get_course_modules.schema.orgUnitId }, async (args) => {
    const result = await contentTools.get_course_modules.handler(args);
    return { content: [{ type: 'text', text: result }] };
});
server.tool('get_course_module', contentTools.get_course_module.description, {
    orgUnitId: contentTools.get_course_module.schema.orgUnitId,
    moduleId: contentTools.get_course_module.schema.moduleId,
}, async (args) => {
    const result = await contentTools.get_course_module.handler(args);
    return { content: [{ type: 'text', text: result }] };
});
// Register grade tools
server.tool('get_my_grades', gradeTools.get_my_grades.description, { orgUnitId: gradeTools.get_my_grades.schema.orgUnitId }, async (args) => {
    const result = await gradeTools.get_my_grades.handler(args);
    return { content: [{ type: 'text', text: result }] };
});
// Register calendar tools
server.tool('get_upcoming_due_dates', calendarTools.get_upcoming_due_dates.description, {
    orgUnitId: calendarTools.get_upcoming_due_dates.schema.orgUnitId,
    daysBack: calendarTools.get_upcoming_due_dates.schema.daysBack,
    daysAhead: calendarTools.get_upcoming_due_dates.schema.daysAhead,
}, async (args) => {
    const result = await calendarTools.get_upcoming_due_dates.handler(args);
    return { content: [{ type: 'text', text: result }] };
});
// Register news tools
server.tool('get_announcements', newsTools.get_announcements.description, { orgUnitId: newsTools.get_announcements.schema.orgUnitId }, async (args) => {
    const result = await newsTools.get_announcements.handler(args);
    return { content: [{ type: 'text', text: result }] };
});
// Register enrollment tools
server.tool('get_my_courses', enrollmentTools.get_my_courses.description, {}, async () => {
    const result = await enrollmentTools.get_my_courses.handler();
    return { content: [{ type: 'text', text: result }] };
});
// Register file tools
server.tool('download_file', 'Download a file from D2L Brightspace. Provide a D2L content URL (e.g., https://learn.ul.ie/content/enforced/68929-CS4444.../file.docx or /content/enforced/...). The file will be saved to your Downloads folder by default, or to a custom path if specified. Returns the local file path, filename, size, and content type. Use this to download lecture slides, assignment files, course materials, or any file linked in course content.', {
    url: z.string().describe('The D2L URL or path to the file to download (e.g., https://learn.ul.ie/content/enforced/68929-CS4444_SEM1_2025_6/file.docx)'),
    savePath: z.string().optional().describe('Optional: Custom path to save the file (directory or full file path). Defaults to ~/Downloads'),
}, async (args) => {
    const result = await downloadFile(args.url, args.savePath);
    const sizeKB = (result.size / 1024).toFixed(1);
    let text = `Downloaded: ${result.filename}\nPath: ${result.path}\nSize: ${sizeKB} KB\nType: ${result.contentType}`;
    if (result.content) {
        text += `\n\n--- File Content ---\n${result.content}`;
    }
    return { content: [{ type: 'text', text }] };
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('D2L Brightspace MCP server running on stdio');
}
main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
