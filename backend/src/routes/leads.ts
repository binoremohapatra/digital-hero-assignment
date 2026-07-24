import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { requireAuth } from '../middleware/auth';

const router = Router();

const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  budgetRange: z.enum(["<$5k", "$5k-$15k", "$15k-$50k", "$50k+"]),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const statusSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "CLOSED"]),
});

router.post('/', async (req, res) => {
  try {
    const validatedData = leadSchema.parse(req.body);
    const lead = await prisma.lead.create({
      data: validatedData,
    });
    res.status(201).json({ success: true, lead });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, errors: error.errors });
      return;
    }
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.get('/', requireAuth, async (req, res) => {
  try {
    const { search = '', status = 'ALL', page = '1', limit = '10' } = req.query;
    
    const pageNumber = parseInt(page as string, 10) || 1;
    const limitNumber = parseInt(limit as string, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const where: any = {};
    
    if (status !== 'ALL') {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [leads, totalCount] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNumber,
      }),
      prisma.lead.count({ where })
    ]);

    // Calculate "New leads today"
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newLeadsToday = await prisma.lead.count({
      where: {
        createdAt: { gte: today },
        status: 'NEW'
      }
    });

    res.json({
      success: true,
      leads,
      pagination: {
        total: totalCount,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(totalCount / limitNumber),
      },
      stats: {
        newLeadsToday
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.patch('/:id/status', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = statusSchema.parse(req.body);

    const lead = await prisma.lead.update({
      where: { id },
      data: { status: validatedData.status },
    });
    res.json({ success: true, lead });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, errors: error.errors });
      return;
    }
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
